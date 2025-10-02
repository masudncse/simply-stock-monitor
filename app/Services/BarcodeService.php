<?php

namespace App\Services;

use App\Models\Product;
use App\Models\SystemSetting;
use Picqer\Barcode\BarcodeGeneratorSVG;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;

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
        $barcode = $this->ensureBarcodeExists($product);
        $barcodeFormat = $this->getBarcodeFormat();
        
        if ($barcodeFormat === 'QR') {
            return $this->generateQRCodePNG($barcode);
        }
        
        $generator = new BarcodeGeneratorPNG();
        $type = $this->getBarcodeType($barcodeFormat);
        
        $barcodeImage = $generator->getBarcode($barcode, $type, $width, $height);
        return 'data:image/png;base64,' . base64_encode($barcodeImage);
    }

    /**
     * Generate QR code as SVG
     */
    private function generateQRCodeSVG(string $data): string
    {
        $qrCode = QrCode::create($data)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(ErrorCorrectionLevel::Low)
            ->setSize(200)
            ->setMargin(10);

        $writer = new \Endroid\QrCode\Writer\SvgWriter();
        $result = $writer->write($qrCode);
        
        return $result->getString();
    }

    /**
     * Generate QR code as PNG (base64 encoded)
     */
    private function generateQRCodePNG(string $data): string
    {
        $qrCode = QrCode::create($data)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(ErrorCorrectionLevel::Low)
            ->setSize(200)
            ->setMargin(10);

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
        $products = Product::whereIn('id', $productIds)->get();
        $barcodeFormat = $this->getBarcodeFormat();
        $labels = [];

        foreach ($products as $product) {
            $labels[] = [
                'product_id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'price' => $product->price,
                'barcode' => $this->ensureBarcodeExists($product),
                'barcode_format' => $barcodeFormat,
                'barcode_image' => $format === 'svg' 
                    ? $this->generateBarcodeSVG($product)
                    : $this->generateBarcodePNG($product),
            ];
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

