<?php

namespace App\Services;

use App\Models\Product;
use App\Models\SystemSetting;
use Picqer\Barcode\BarcodeGeneratorSVG;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\SvgWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;

class BarcodeService
{
    /**
     * Get the system barcode format setting
     */
    private function getBarcodeFormat(): string
    {
        return SystemSetting::get('barcode_format', 'CODE128');
    }
    /**
     * Generate barcode from SKU if barcode is not set
     */
    public function generateBarcodeFromSku(Product $product): string
    {
        if ($product->barcode) {
            \Log::info("Product already has barcode", [
                'sku' => $product->sku,
                'barcode' => $product->barcode
            ]);
            return $product->barcode;
        }

        // Get the system barcode format
        $barcodeFormat = $this->getBarcodeFormat();

        // Generate barcode from SKU
        // Remove any non-alphanumeric characters
        $cleanSku = preg_replace('/[^a-zA-Z0-9]/', '', $product->sku);
        
        // Depending on format, we may need to adjust the barcode
        switch ($barcodeFormat) {
            case 'EAN13':
                // EAN-13 requires exactly 13 digits
                $barcode = $this->generateEAN13FromSku($cleanSku);
                break;
            case 'QR':
                // QR codes can contain any text
                $barcode = $product->sku;
                break;
            case 'CODE128':
            default:
                // Code 128 is flexible
                $barcode = strtoupper($cleanSku);
                break;
        }

        \Log::info("Generated barcode from SKU", [
            'sku' => $product->sku,
            'clean_sku' => $cleanSku,
            'barcode' => $barcode,
            'format' => $barcodeFormat
        ]);

        // Update the product with the generated barcode
        $product->update(['barcode' => $barcode]);
        
        return $barcode;
    }

    /**
     * Generate EAN-13 barcode from SKU
     * EAN-13 requires exactly 13 digits
     */
    private function generateEAN13FromSku(string $sku): string
    {
        // Convert SKU to numbers
        $numeric = preg_replace('/[^0-9]/', '', $sku);
        
        // If we don't have enough digits, pad with zeros
        if (strlen($numeric) < 12) {
            $numeric = str_pad($numeric, 12, '0', STR_PAD_LEFT);
        } else if (strlen($numeric) > 12) {
            // If too long, take last 12 digits
            $numeric = substr($numeric, -12);
        }
        
        // Calculate check digit
        $checksum = 0;
        for ($i = 0; $i < 12; $i++) {
            $checksum += (int)$numeric[$i] * (($i % 2 === 0) ? 1 : 3);
        }
        $checkDigit = (10 - ($checksum % 10)) % 10;
        
        return $numeric . $checkDigit;
    }

    /**
     * Generate barcode image as SVG
     */
    public function generateBarcodeSVG(Product $product): string
    {
        $barcode = $this->ensureBarcodeExists($product);
        $barcodeFormat = $this->getBarcodeFormat();
        
        if ($barcodeFormat === 'QR') {
            return $this->generateQRCodeSVG($barcode);
        }
        
        $generator = new BarcodeGeneratorSVG();
        $type = $this->getBarcodeType($barcodeFormat);
        
        return $generator->getBarcode($barcode, $type, 2, 50);
    }

    /**
     * Generate barcode image as PNG (base64 encoded)
     */
    public function generateBarcodePNG(Product $product, int $width = 2, int $height = 50): string
    {
        try {
            $barcode = $this->ensureBarcodeExists($product);
            $barcodeFormat = $this->getBarcodeFormat();
            
            \Log::info("Generating barcode image", [
                'product_id' => $product->id,
                'sku' => $product->sku,
                'barcode' => $barcode,
                'format' => $barcodeFormat
            ]);
            
            if ($barcodeFormat === 'QR') {
                return $this->generateQRCodePNG($barcode);
            }
            
            $generator = new BarcodeGeneratorPNG();
            $type = $this->getBarcodeType($barcodeFormat);
            
            \Log::info("Barcode type selected", ['type' => $type]);
            
            $barcodeImage = $generator->getBarcode($barcode, $type, $width, $height);
            
            \Log::info("Raw barcode image generated", [
                'length' => strlen($barcodeImage),
                'first_bytes' => bin2hex(substr($barcodeImage, 0, 10))
            ]);
            
            $encoded = base64_encode($barcodeImage);
            $result = 'data:image/png;base64,' . $encoded;
            
            \Log::info("Encoded barcode image", [
                'encoded_length' => strlen($encoded),
                'total_length' => strlen($result),
                'prefix' => substr($result, 0, 50)
            ]);
            
            return $result;
        } catch (\Exception $e) {
            \Log::error("Failed to generate PNG barcode", [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Generate QR code as SVG
     */
    private function generateQRCodeSVG(string $data): string
    {
        $qrCode = new QrCode(
            data: $data,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::Low,
            size: 200,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );
        
        $writer = new SvgWriter();
        $result = $writer->write($qrCode);
        
        return $result->getString();
    }

    /**
     * Generate QR code as PNG (base64 encoded)
     */
    private function generateQRCodePNG(string $data): string
    {
        $qrCode = new QrCode(
            data: $data,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::Low,
            size: 200,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );
        
        $writer = new PngWriter();
        $result = $writer->write($qrCode);
        
        return 'data:image/png;base64,' . base64_encode($result->getString());
    }

    /**
     * Ensure product has a barcode, generate if needed
     */
    private function ensureBarcodeExists(Product $product): string
    {
        if (!$product->barcode) {
            return $this->generateBarcodeFromSku($product);
        }
        return $product->barcode;
    }

    /**
     * Get barcode type constant for the generator
     */
    private function getBarcodeType(string $format): string
    {
        return match($format) {
            'CODE128' => BarcodeGeneratorPNG::TYPE_CODE_128,
            'EAN13' => BarcodeGeneratorPNG::TYPE_EAN_13,
            default => BarcodeGeneratorPNG::TYPE_CODE_128,
        };
    }

    /**
     * Generate barcode labels for printing (multiple products)
     */
    public function generateBarcodeLabels(array $productIds, string $format = 'png'): array
    {
        // Convert to new format for backward compatibility
        $productsWithQuantities = array_map(fn($id) => ['id' => $id, 'quantity' => 1], $productIds);
        return $this->generateBarcodeLabelsWithQuantities($productsWithQuantities, $format);
    }

    /**
     * Generate barcode labels with quantities for printing
     */
    public function generateBarcodeLabelsWithQuantities(array $productsData, string $format = 'png'): array
    {
        $productIds = array_column($productsData, 'id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
        $barcodeFormat = $this->getBarcodeFormat();
        $labels = [];

        foreach ($productsData as $productData) {
            $productId = $productData['id'];
            $quantity = $productData['quantity'] ?? 1;
            
            if (!isset($products[$productId])) {
                continue;
            }
            
            $product = $products[$productId];

            try {
                // Ensure barcode exists
                $barcode = $this->ensureBarcodeExists($product);
                
                // Generate barcode image once
                $barcodeImage = $format === 'svg' 
                    ? $this->generateBarcodeSVG($product)
                    : $this->generateBarcodePNG($product);

                $labelData = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'price' => $product->price,
                    'barcode' => $barcode,
                    'barcode_format' => $barcodeFormat,
                    'barcode_image' => $barcodeImage,
                ];

                // Duplicate the label based on quantity
                for ($i = 0; $i < $quantity; $i++) {
                    $labels[] = $labelData;
                }

                \Log::info("Generated barcode for product: {$product->sku}", [
                    'barcode' => $barcode,
                    'format' => $barcodeFormat,
                    'quantity' => $quantity,
                    'image_length' => strlen($barcodeImage)
                ]);
            } catch (\Exception $e) {
                \Log::error("Failed to generate barcode for product: {$product->sku}", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                // Add label with error placeholder
                for ($i = 0; $i < $quantity; $i++) {
                    $labels[] = [
                        'product_id' => $product->id,
                        'sku' => $product->sku,
                        'name' => $product->name,
                        'price' => $product->price,
                        'barcode' => $product->barcode ?? 'ERROR',
                        'barcode_format' => $barcodeFormat,
                        'barcode_image' => '',
                    ];
                }
            }
        }

        return $labels;
    }

    /**
     * Available barcode formats
     */
    public static function getAvailableFormats(): array
    {
        return [
            'CODE128' => 'Code 128',
            'EAN13' => 'EAN-13',
            'QR' => 'QR Code',
        ];
    }
}

