import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Barcode, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface BarcodeDisplayProps {
  productId: number;
  sku: string;
  barcode?: string;
  barcodeFormat?: string;
  showGenerateButton?: boolean;
}

export function BarcodeDisplay({ 
  productId, 
  sku, 
  barcode: initialBarcode, 
  barcodeFormat = 'CODE128',
  showGenerateButton = false 
}: BarcodeDisplayProps) {
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState(initialBarcode);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (barcode) {
      loadBarcodeImage();
    }
  }, [barcode, productId]);

  const loadBarcodeImage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/products/${productId}/barcode-image`, {
        params: { format: 'png' }
      });
      if (response.data.success) {
        setBarcodeImage(response.data.barcode_image);
        setBarcode(response.data.barcode);
      }
    } catch (error) {
      console.error('Failed to load barcode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBarcode = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(`/products/${productId}/generate-barcode`);
      if (response.data.success) {
        setBarcode(response.data.barcode);
        // Reload the barcode image
        await loadBarcodeImage();
      }
    } catch (error) {
      console.error('Failed to generate barcode:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!barcodeImage) return;

    const link = document.createElement('a');
    link.href = barcodeImage;
    link.download = `barcode-${sku}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!barcode && !showGenerateButton) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="h-5 w-5" />
            Barcode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No barcode generated yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Barcode className="h-5 w-5" />
          Barcode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : barcodeImage ? (
          <div className="space-y-4">
            <div className="flex justify-center items-center p-4 bg-white border rounded-lg">
              <img 
                src={barcodeImage} 
                alt={`Barcode for ${sku}`}
                className="max-w-full h-auto"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Barcode: <span className="font-mono">{barcode}</span></p>
              <p className="text-sm text-muted-foreground">Format: {barcodeFormat}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {showGenerateButton && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateBarcode}
                  disabled={generating}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">No barcode image available</p>
            {showGenerateButton && (
              <Button
                size="sm"
                onClick={handleGenerateBarcode}
                disabled={generating}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                Generate Barcode from SKU
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

