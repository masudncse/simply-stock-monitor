<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\BarcodeService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-products');

        $query = Product::with(['category', 'images']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'name'); // Default sort by name
        $sortDirection = $request->get('sort_direction', 'asc'); // Default ascending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['name', 'sku', 'price', 'cost_price', 'unit', 'is_active', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'name';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        
        // Apply sorting
        $query->orderBy($sortBy, $sortDirection);

        $perPage = $request->get('per_page', 15);
        $products = $query->paginate($perPage)->appends($request->query());

        // Only send selected category if filter is active (for display purposes)
        $selectedCategory = null;
        if ($request->filled('category_id')) {
            $selectedCategory = Category::find($request->category_id);
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $selectedCategory ? [$selectedCategory] : [], // Only send selected category
            'filters' => $request->only(['search', 'category_id', 'status', 'sort_by', 'sort_direction', 'page', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-products');

        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $this->authorize('create-products');

        $validated = $request->validated();
        
        // Remove images from validated data as we'll handle them separately
        $images = $validated['images'] ?? [];
        unset($validated['images']);

        $product = Product::create($validated);

        // Handle image uploads
        if (!empty($images)) {
            $this->uploadProductImages($product, $images);
        }

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $this->authorize('view-products');

        $product->load(['category', 'stocks.warehouse']);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $this->authorize('edit-products');

        $categories = Category::where('is_active', true)->get();
        
        // Load product with images
        $product->load('images');

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('edit-products');

        $validated = $request->validated();
        
        // Remove images from validated data as we'll handle them separately
        $images = $validated['images'] ?? [];
        unset($validated['images']);

        $product->update($validated);

        // Handle new image uploads
        if (!empty($images)) {
            $this->uploadProductImages($product, $images);
        }

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete-products');

        // Check if product has any transactions
        if ($product->purchaseItems()->exists() || $product->saleItems()->exists()) {
            return redirect()->route('products.index')
                ->with('error', 'Cannot delete product with existing transactions.');
        }

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Get products for select dropdown
     */
    public function getProducts(Request $request)
    {
        $query = Product::where('is_active', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%");
            });
        }

        return $query->limit(20)->get(['id', 'name', 'sku', 'price', 'unit']);
    }

    /**
     * Search categories for API (autocomplete/select)
     */
    public function searchCategories(Request $request)
    {
        $search = $request->input('search', '');
        
        $categories = Category::query()
            ->where('is_active', true)
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->limit(50)  // Return max 50 results
            ->get(['id', 'name']);
        
        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Search products for API (autocomplete/select)
     */
    public function searchProducts(Request $request)
    {
        $search = $request->input('search', '');
        
        $products = Product::query()
            ->where('is_active', true)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->orderBy('name', 'asc')
            ->limit(50)  // Return max 50 results
            ->get(['id', 'name', 'sku', 'price', 'unit']);
        
        return response()->json([
            'products' => $products
        ]);
    }

    /**
     * Delete a specific product image.
     */
    public function deleteImage(ProductImage $productImage)
    {
        $this->authorize('edit-products');

        $productImage->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Set a product image as primary.
     */
    public function setPrimaryImage(ProductImage $productImage)
    {
        $this->authorize('edit-products');

        // Remove primary status from all other images of this product
        ProductImage::where('product_id', $productImage->product_id)
            ->update(['is_primary' => false]);

        // Set this image as primary
        $productImage->update(['is_primary' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Upload product images.
     */
    private function uploadProductImages(Product $product, array $images)
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
     * Generate barcode for a product
     */
    public function generateBarcode(Product $product, BarcodeService $barcodeService)
    {
        $this->authorize('edit-products');

        $barcode = $barcodeService->generateBarcodeFromSku($product);

        return response()->json([
            'success' => true,
            'barcode' => $barcode,
            'message' => 'Barcode generated successfully',
        ]);
    }

    /**
     * Get barcode image for a product
     */
    public function getBarcodeImage(Product $product, Request $request, BarcodeService $barcodeService)
    {
        $this->authorize('view-products');

        $format = $request->get('format', 'png');
        
        try {
            $barcodeImage = $format === 'svg' 
                ? $barcodeService->generateBarcodeSVG($product)
                : $barcodeService->generateBarcodePNG($product);

            return response()->json([
                'success' => true,
                'barcode_image' => $barcodeImage,
                'barcode' => $product->barcode,
                'barcode_format' => \App\Models\SystemSetting::get('barcode_format', 'CODE128'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate barcode: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Print barcode labels (individual or bulk)
     */
    public function printBarcodeLabels(Request $request, BarcodeService $barcodeService)
    {
        $this->authorize('view-products');

        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'format' => 'nullable|in:png,svg',
        ]);

        $labels = $barcodeService->generateBarcodeLabels(
            $request->product_ids,
            $request->get('format', 'png')
        );

        return Inertia::render('Products/PrintBarcodeLabels', [
            'labels' => $labels,
        ]);
    }

    /**
     * Get available barcode formats
     */
    public function getBarcodeFormats()
    {
        return response()->json([
            'formats' => BarcodeService::getAvailableFormats(),
        ]);
    }
}