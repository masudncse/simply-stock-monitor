import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CategoryCombobox } from '@/components/CategoryCombobox';
import { Search, Trash2, X, Printer, Plus, Filter } from 'lucide-react';
import { useBarcodeQueue } from '@/hooks/useBarcodeQueue';
import { router } from '@inertiajs/react';
import axios from 'axios';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  barcode?: string;
  unit: string;
  category?: {
    id: number;
    name: string;
  };
}

interface BarcodeQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BarcodeQueueModal({ isOpen, onClose }: BarcodeQueueModalProps) {
  const { queue, addToQueue, updateQuantity, removeFromQueue, clearQueue, isInQueue, getQueueWithQuantities, getTotalLabels } = useBarcodeQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1 || categoryFilter) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, categoryFilter]);

  const searchProducts = async () => {
    setIsSearching(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category_id = categoryFilter;
      
      const response = await axios.get('/products-api/search', { params });
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToQueue = (product: Product) => {
    addToQueue({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      barcode: product.barcode,
    });
    // Don't clear search - keep results visible
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSearchResults([]);
  };

  const handlePrintQueue = () => {
    if (queue.length === 0) {
      alert('No products in queue');
      return;
    }
    
    router.post('/products/print-barcode-labels', {
      products: getQueueWithQuantities(),
      format: 'png'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Barcode Print Queue</DialogTitle>
          <DialogDescription>
            Add products to your print queue and print all barcodes at once
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search Section */}
          <div className="space-y-2">
            <Label htmlFor="product-search">Search Products to Add</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="product-search"
                  placeholder="Search by name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <CategoryCombobox
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  placeholder="Filter by category"
                  showAllOption={true}
                />
                {(searchTerm || categoryFilter || searchResults.length > 0) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {product.category?.name || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {isInQueue(product.id) ? (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Added
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => handleAddToQueue(product)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {isSearching && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}
          </div>

          {/* Queue List */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div>
                <Label>Print Queue ({queue.length} products, {getTotalLabels()} labels)</Label>
              </div>
              {queue.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearQueue}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border rounded-lg border-dashed">
                <div className="text-center text-muted-foreground p-8">
                  <p className="text-sm">No products in queue</p>
                  <p className="text-xs mt-1">Search and add products above</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 border rounded-lg max-h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead className="w-24">Quantity</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queue.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {product.barcode ? (
                            <span className="font-mono text-xs">{product.barcode}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">Auto-generate</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max="999"
                            value={product.quantity}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                            className="h-8 w-20 text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeFromQueue(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handlePrintQueue}
            disabled={queue.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print {getTotalLabels()} Label{getTotalLabels() !== 1 ? 's' : ''} ({queue.length} product{queue.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

