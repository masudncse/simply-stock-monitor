<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Create a new product with images
     */
    public function createProduct(array $productData, array $images = []): Product
    {
        return DB::transaction(function () use ($productData, $images) {
            $product = Product::create($productData);

            // Handle image uploads
            if (!empty($images)) {
                $this->uploadProductImages($product, $images);
            }

            return $product->fresh(['category', 'images']);
        });
    }

    /**
     * Update a product with images
     */
    public function updateProduct(Product $product, array $productData, array $images = []): Product
    {
        return DB::transaction(function () use ($product, $productData, $images) {
            $product->update($productData);

            // Handle image uploads if any
            if (!empty($images)) {
                $this->uploadProductImages($product, $images);
            }

            return $product->fresh(['category', 'images']);
        });
    }

    /**
     * Delete a product and its associated images
     */
    public function deleteProduct(Product $product): bool
    {
        // Check if product has any transactions
        if ($product->purchaseItems()->exists() || $product->saleItems()->exists()) {
            throw new \Exception('Cannot delete product with existing transactions.');
        }

        return DB::transaction(function () use ($product) {
            // Delete all product images from storage
            foreach ($product->images as $image) {
                $this->deleteProductImage($image);
            }

            return $product->delete();
        });
    }

    /**
     * Upload product images
     */
    public function uploadProductImages(Product $product, array $images): void
    {
        $sortOrder = $product->images()->max('sort_order') ?? 0;
        $hasPrimary = $product->images()->where('is_primary', true)->exists();

        foreach ($images as $image) {
            $sortOrder++;
            
            // Store the image
            $path = $image->store('products', 'public');
            
            // Create the database record
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'sort_order' => $sortOrder,
                'is_primary' => !$hasPrimary && $sortOrder === 1, // First image is primary if none exists
            ]);
        }
    }

    /**
     * Delete a product image
     */
    public function deleteProductImage(ProductImage $productImage): bool
    {
        // Delete the file from storage
        if (Storage::disk('public')->exists($productImage->image_path)) {
            Storage::disk('public')->delete($productImage->image_path);
        }

        return $productImage->delete();
    }

    /**
     * Set a product image as primary
     */
    public function setPrimaryImage(ProductImage $productImage): bool
    {
        return DB::transaction(function () use ($productImage) {
            // Remove primary status from all images of this product
            ProductImage::where('product_id', $productImage->product_id)
                ->update(['is_primary' => false]);

            // Set this image as primary
            $productImage->is_primary = true;
            return $productImage->save();
        });
    }

    /**
     * Reorder product images
     */
    public function reorderImages(Product $product, array $imageOrder): bool
    {
        return DB::transaction(function () use ($product, $imageOrder) {
            foreach ($imageOrder as $order => $imageId) {
                ProductImage::where('id', $imageId)
                    ->where('product_id', $product->id)
                    ->update(['sort_order' => $order + 1]);
            }
            return true;
        });
    }

    /**
     * Toggle product active status
     */
    public function toggleActiveStatus(Product $product): Product
    {
        $product->is_active = !$product->is_active;
        $product->save();

        return $product;
    }

    /**
     * Get product with stock information
     */
    public function getProductWithStock(int $productId): Product
    {
        return Product::with(['category', 'stocks.warehouse', 'images'])
            ->findOrFail($productId);
    }

    /**
     * Duplicate a product
     */
    public function duplicateProduct(Product $product): Product
    {
        return DB::transaction(function () use ($product) {
            $newProduct = $product->replicate();
            $newProduct->sku = $this->generateUniqueSku($product->sku);
            $newProduct->barcode = null; // Clear barcode for new product
            $newProduct->save();

            // Copy images if any
            foreach ($product->images as $image) {
                $newImagePath = $this->copyImageFile($image->image_path);
                
                ProductImage::create([
                    'product_id' => $newProduct->id,
                    'image_path' => $newImagePath,
                    'sort_order' => $image->sort_order,
                    'is_primary' => $image->is_primary,
                ]);
            }

            return $newProduct->fresh(['category', 'images']);
        });
    }

    /**
     * Generate unique SKU for duplicated product
     */
    private function generateUniqueSku(string $baseSku): string
    {
        $newSku = $baseSku . '-COPY';
        $counter = 1;

        while (Product::where('sku', $newSku)->exists()) {
            $newSku = $baseSku . '-COPY-' . $counter;
            $counter++;
        }

        return $newSku;
    }

    /**
     * Copy image file for duplicated product
     */
    private function copyImageFile(string $originalPath): string
    {
        if (!Storage::disk('public')->exists($originalPath)) {
            throw new \Exception("Original image not found: {$originalPath}");
        }

        $pathInfo = pathinfo($originalPath);
        $newPath = $pathInfo['dirname'] . '/' . uniqid() . '.' . $pathInfo['extension'];

        Storage::disk('public')->copy($originalPath, $newPath);

        return $newPath;
    }
}

