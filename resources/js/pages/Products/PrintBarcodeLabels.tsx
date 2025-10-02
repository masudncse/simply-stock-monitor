import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Printer, ArrowLeft, X, Layout, Settings2 } from 'lucide-react';
import { router, Head } from '@inertiajs/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

type ColumnCount = number;

interface DisplayOptions {
  showTitle: boolean;
  showSku: boolean;
  showBarcodeNumber: boolean;
  showPrice: boolean;
}

interface LabelCustomization {
  width: string;
  height: string;
  padding: string;
  showBorder: boolean;
}

export default function PrintBarcodeLabels({ labels }: PrintBarcodeLabelsProps) {
  const [columns, setColumns] = useState<ColumnCount>(3);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showTitle: true,
    showSku: true,
    showBarcodeNumber: true,
    showPrice: true,
  });
  const [labelCustomization, setLabelCustomization] = useState<LabelCustomization>({
    width: 'auto',
    height: 'auto',
    padding: '12px',
    showBorder: true,
  });

  const handlePrint = () => {
    if (!imagesLoaded) {
      alert('Please wait for all barcode images to load before printing.');
      return;
    }
    window.print();
  };

  const handleClose = () => {
    router.visit('/products');
  };

  const getGridClass = (cols: ColumnCount) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      case 7: return 'grid-cols-7';
      case 8: return 'grid-cols-8';
      case 9: return 'grid-cols-9';
      case 10: return 'grid-cols-10';
      case 11: return 'grid-cols-11';
      case 12: return 'grid-cols-12';
      default: return 'grid-cols-3';
    }
  };

  const getScreenGridClass = (cols: ColumnCount) => {
    switch (cols) {
      case 1: return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
      case 6: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6';
      case 7: return 'grid-cols-1 md:grid-cols-4 lg:grid-cols-7';
      case 8: return 'grid-cols-1 md:grid-cols-4 lg:grid-cols-8';
      case 9: return 'grid-cols-1 md:grid-cols-4 lg:grid-cols-9';
      case 10: return 'grid-cols-1 md:grid-cols-5 lg:grid-cols-10';
      case 11: return 'grid-cols-1 md:grid-cols-5 lg:grid-cols-11';
      case 12: return 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const handleImageLoad = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= labels.length) {
        setImagesLoaded(true);
      }
      return newCount;
    });
  };

  const handleImageError = (sku: string) => {
    console.error(`Failed to load barcode image for SKU: ${sku}`);
  };

  // Debug: Log barcode data
  useEffect(() => {
    console.log('Barcode Labels Data:', labels);
    labels.forEach((label, index) => {
      console.log(`Label ${index + 1}:`, {
        sku: label.sku,
        name: label.name,
        barcode: label.barcode,
        barcode_format: label.barcode_format,
        barcode_image_length: label.barcode_image?.length,
        barcode_image_prefix: label.barcode_image?.substring(0, 50)
      });
    });
  }, []);

  // Auto-print on load (optional)
  useEffect(() => {
    // Uncomment the line below if you want auto-print on page load
    // if (imagesLoaded) {
    //   const timer = setTimeout(() => window.print(), 500);
    //   return () => clearTimeout(timer);
    // }
  }, [imagesLoaded]);

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Display Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Layout</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Layout className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="columns" className="text-sm">Columns:</Label>
                          <Select 
                            value={columns.toString()} 
                            onValueChange={(value) => setColumns(parseInt(value) as ColumnCount)}
                          >
                            <SelectTrigger id="columns" className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="11">11</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm mb-3">Show on Labels</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showTitle"
                            checked={displayOptions.showTitle}
                            onCheckedChange={(checked) => 
                              setDisplayOptions(prev => ({ ...prev, showTitle: checked as boolean }))
                            }
                          />
                          <Label htmlFor="showTitle" className="text-sm cursor-pointer">
                            Product Name
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showSku"
                            checked={displayOptions.showSku}
                            onCheckedChange={(checked) => 
                              setDisplayOptions(prev => ({ ...prev, showSku: checked as boolean }))
                            }
                          />
                          <Label htmlFor="showSku" className="text-sm cursor-pointer">
                            SKU
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showBarcodeNumber"
                            checked={displayOptions.showBarcodeNumber}
                            onCheckedChange={(checked) => 
                              setDisplayOptions(prev => ({ ...prev, showBarcodeNumber: checked as boolean }))
                            }
                          />
                          <Label htmlFor="showBarcodeNumber" className="text-sm cursor-pointer">
                            Barcode Number
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showPrice"
                            checked={displayOptions.showPrice}
                            onCheckedChange={(checked) => 
                              setDisplayOptions(prev => ({ ...prev, showPrice: checked as boolean }))
                            }
                          />
                          <Label htmlFor="showPrice" className="text-sm cursor-pointer">
                            Price
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm mb-3">Label Customization</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="labelWidth" className="text-xs">Width (px or auto)</Label>
                          <Input
                            id="labelWidth"
                            type="text"
                            value={labelCustomization.width}
                            onChange={(e) => 
                              setLabelCustomization(prev => ({ ...prev, width: e.target.value }))
                            }
                            placeholder="auto"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="labelHeight" className="text-xs">Height (px or auto)</Label>
                          <Input
                            id="labelHeight"
                            type="text"
                            value={labelCustomization.height}
                            onChange={(e) => 
                              setLabelCustomization(prev => ({ ...prev, height: e.target.value }))
                            }
                            placeholder="auto"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="labelPadding" className="text-xs">Padding (px)</Label>
                          <Input
                            id="labelPadding"
                            type="text"
                            value={labelCustomization.padding}
                            onChange={(e) => 
                              setLabelCustomization(prev => ({ ...prev, padding: e.target.value }))
                            }
                            placeholder="12px"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showBorder"
                            checked={labelCustomization.showBorder}
                            onCheckedChange={(checked) => 
                              setLabelCustomization(prev => ({ ...prev, showBorder: checked as boolean }))
                            }
                          />
                          <Label htmlFor="showBorder" className="text-sm cursor-pointer">
                            Show Border
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="h-6 w-px bg-border" />
              <Button onClick={handlePrint} size="sm" disabled={!imagesLoaded}>
                <Printer className="mr-2 h-4 w-4" />
                {imagesLoaded ? 'Print' : `Loading... (${loadedCount}/${labels.length})`}
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
                {displayOptions.showTitle && (
                  <div className="text-center">
                    <h3 className="font-semibold text-base truncate" title={label.name}>
                      {label.name}
                    </h3>
                  </div>
                )}
                
                {/* SKU */}
                {displayOptions.showSku && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      SKU: {label.sku}
                    </p>
                  </div>
                )}

                {/* Barcode Image */}
                <div className="flex justify-center items-center bg-white p-3 border rounded-md">
                  {label.barcode_format === 'QR' ? (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      className="w-36 h-36 object-contain"
                      onLoad={handleImageLoad}
                      onError={() => handleImageError(label.sku)}
                    />
                  ) : (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      className="max-w-full h-20 object-contain"
                      onLoad={handleImageLoad}
                      onError={() => handleImageError(label.sku)}
                    />
                  )}
                </div>

                {/* Barcode Number */}
                {displayOptions.showBarcodeNumber && (
                  <div className="text-center">
                    <p className="text-xs font-mono tracking-wider">{label.barcode}</p>
                  </div>
                )}

                {/* Price */}
                {displayOptions.showPrice && (
                  <div className="text-center border-t pt-2">
                    <p className="text-xl font-bold">
                      ${label.price.toFixed(2)}
                    </p>
                  </div>
                )}
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
              className={`rounded-lg break-inside-avoid ${labelCustomization.showBorder ? 'border-2 border-black' : ''}`}
              style={{ 
                pageBreakInside: 'avoid',
                width: labelCustomization.width,
                height: labelCustomization.height,
                padding: labelCustomization.padding,
              }}
            >
              {/* Product Name */}
              {displayOptions.showTitle && (
                <div className="text-center mb-2">
                  <h3 className="font-bold text-sm leading-tight" style={{ fontSize: '13px' }}>
                    {label.name}
                  </h3>
                </div>
              )}

              {/* SKU */}
              {displayOptions.showSku && (
                <div className="text-center mb-2">
                  <p className="text-xs" style={{ fontSize: '10px', color: '#666' }}>
                    SKU: {label.sku}
                  </p>
                </div>
              )}

              {/* Barcode Image */}
              <div className="flex justify-center items-center bg-white p-2 border border-gray-300 rounded mb-2">
                {label.barcode_image ? (
                  label.barcode_format === 'QR' ? (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                      className='print:visible '
                    />
                  ) : (
                    <img 
                      src={label.barcode_image} 
                      alt={`Barcode for ${label.sku}`}
                      style={{ maxWidth: '100%', height: '60px', objectFit: 'contain' }}
                      className='print:visible '
                    />
                  )
                ) : (
                  <div style={{ fontSize: '10px', color: '#999', padding: '20px' }}>
                    No barcode available
                  </div>
                )}
              </div>

              {/* Barcode Number */}
              {displayOptions.showBarcodeNumber && (
                <div className="text-center mb-2">
                  <p className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                    {label.barcode}
                  </p>
                </div>
              )}

              {/* Price */}
              {displayOptions.showPrice && (
                <div className="text-center border-t-2 border-gray-300 pt-2">
                  <p className="font-bold" style={{ fontSize: '16px' }}>
                    ${label.price.toFixed(2)}
                  </p>
                </div>
              )}
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
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
          .grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
          .grid-cols-7 { grid-template-columns: repeat(7, minmax(0, 1fr)) !important; }
          .grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)) !important; }
          .grid-cols-9 { grid-template-columns: repeat(9, minmax(0, 1fr)) !important; }
          .grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)) !important; }
          .grid-cols-11 { grid-template-columns: repeat(11, minmax(0, 1fr)) !important; }
          .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
          
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

