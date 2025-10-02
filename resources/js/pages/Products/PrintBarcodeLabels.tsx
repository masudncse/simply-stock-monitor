import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Printer, ArrowLeft, X, Layout } from 'lucide-react';
import { router, Head } from '@inertiajs/react';

interface BarcodeLabel {
  product_id: number;
  sku: string;
  name: string;
  price: number;
  barcode: string;
  barcode_format: string;
  barcode_image: string;
}

interface PrintBarcodeLabelsProps {
  labels: BarcodeLabel[];
}

type ColumnCount = 3 | 4 | 5;

export default function PrintBarcodeLabels({ labels }: PrintBarcodeLabelsProps) {
  const [columns, setColumns] = useState<ColumnCount>(3);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    router.visit('/products');
  };

  const getGridClass = (cols: ColumnCount) => {
    switch (cols) {
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      default:
        return 'grid-cols-3';
    }
  };

  const getScreenGridClass = (cols: ColumnCount) => {
    switch (cols) {
      case 3:
        return 'md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'md:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'md:grid-cols-3 lg:grid-cols-5';
      default:
        return 'md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Auto-print on load (optional)
  useEffect(() => {
    // Uncomment the line below if you want auto-print on page load
    // const timer = setTimeout(() => window.print(), 500);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title="Print Barcode Labels" />
      
      {/* Screen-only controls */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Print Barcode Labels</h1>
              <p className="text-sm text-muted-foreground">
                {labels.length} label{labels.length !== 1 ? 's' : ''} ready to print
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="columns" className="text-sm font-medium whitespace-nowrap">
                  Columns:
                </Label>
                <Select 
                  value={columns.toString()} 
                  onValueChange={(value) => setColumns(parseInt(value) as ColumnCount)}
                >
                  <SelectTrigger id="columns" className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-6 w-px bg-border" />
              <Button onClick={handlePrint} size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleClose} size="sm">
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Area */}
      <div className="print:hidden pt-20 pb-8 px-4 container mx-auto">
        <div className={`grid grid-cols-1 ${getScreenGridClass(columns)} gap-4`}>
          {labels.map((label, index) => (
            <Card key={`${label.product_id}-${index}`} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                {/* Product Name */}
                <div className="text-center">
                  <h3 className="font-semibold text-base truncate" title={label.name}>
                    {label.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    SKU: {label.sku}
                  </p>
                </div>

                {/* Barcode Image */}
                <div className="flex justify-center items-center bg-white p-3 border rounded-md">
                  {label.barcode_format === 'QR' ? (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      className="w-36 h-36 object-contain"
                    />
                  ) : (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      className="max-w-full h-20 object-contain"
                    />
                  )}
                </div>

                {/* Barcode Number */}
                <div className="text-center">
                  <p className="text-xs font-mono tracking-wider">{label.barcode}</p>
                </div>

                {/* Price */}
                <div className="text-center border-t pt-2">
                  <p className="text-xl font-bold">
                    ${label.price.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Print-only layout */}
      <div className="hidden print:block">
        <div className={`grid ${getGridClass(columns)} gap-3 p-4`}>
          {labels.map((label, index) => (
            <div 
              key={`${label.product_id}-${index}`} 
              className="border-2 border-black rounded-lg p-3 break-inside-avoid"
              style={{ pageBreakInside: 'avoid' }}
            >
              {/* Product Name */}
              <div className="text-center mb-2">
                <h3 className="font-bold text-sm leading-tight" style={{ fontSize: '13px' }}>
                  {label.name}
                </h3>
                <p className="text-xs mt-1" style={{ fontSize: '10px', color: '#666' }}>
                  SKU: {label.sku}
                </p>
              </div>

              {/* Barcode Image */}
              <div className="flex justify-center items-center bg-white p-2 border border-gray-300 rounded mb-2">
                {label.barcode_format === 'QR' ? (
                  <img 
                    src={label.barcode_image} 
                    alt={`Barcode for ${label.sku}`}
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                  />
                ) : (
                  <img 
                    src={label.barcode_image} 
                    alt={`Barcode for ${label.sku}`}
                    style={{ maxWidth: '100%', height: '60px', objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* Barcode Number */}
              <div className="text-center mb-2">
                <p className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                  {label.barcode}
                </p>
              </div>

              {/* Price */}
              <div className="text-center border-t-2 border-gray-300 pt-2">
                <p className="font-bold" style={{ fontSize: '16px' }}>
                  ${label.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Hide everything except print area */
          body > div:not(.hidden) {
            display: none !important;
          }
          
          .hidden.print\\:block {
            display: block !important;
          }
          
          /* Dynamic grid columns for print */
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          
          .grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          
          .grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          
          /* Ensure proper page breaks */
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
        
        /* Screen preview styles */
        @media screen {
          body {
            background-color: #f5f5f5;
          }
        }
      `}</style>
    </>
  );
}

