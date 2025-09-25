import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft as BackIcon, Info as InfoIcon, AlertTriangle as WarningIcon } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface StockAdjustProps {
  products: Product[];
  warehouses: Warehouse[];
}

export default function StockAdjust({ products, warehouses }: StockAdjustProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    warehouse_id: '',
    new_quantity: 0,
    batch: '',
    reason: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentStock, setCurrentStock] = useState<number>(0);

  const handleProductChange = (productId: string) => {
    setData('product_id', productId);
    const product = products.find(p => p.id.toString() === productId);
    setSelectedProduct(product || null);
    // In a real app, you'd fetch current stock from API
    setCurrentStock(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/stock/adjust', {
      onSuccess: () => {
        reset();
        setSelectedProduct(null);
        setCurrentStock(0);
      },
    });
  };

  return (
    <Layout title="Adjust Stock">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Adjust Stock</h1>
            <p className="text-muted-foreground">
              Correct inventory discrepancies and update stock levels
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/stock">
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Stock
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select value={data.product_id} onValueChange={handleProductChange}>
                    <SelectTrigger className={errors.product_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.product_id && (
                    <p className="text-sm text-destructive">{errors.product_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse *</Label>
                  <Select value={data.warehouse_id} onValueChange={(value) => setData('warehouse_id', value)}>
                    <SelectTrigger className={errors.warehouse_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouse_id && (
                    <p className="text-sm text-destructive">{errors.warehouse_id}</p>
                  )}
                </div>
              </div>

              {selectedProduct && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Current Stock:</strong> {currentStock} units
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_quantity">New Quantity *</Label>
                  <Input
                    id="new_quantity"
                    type="number"
                    step="0.01"
                    value={data.new_quantity}
                    onChange={(e) => setData('new_quantity', parseFloat(e.target.value) || 0)}
                    className={errors.new_quantity ? 'border-destructive' : ''}
                    required
                  />
                  {errors.new_quantity && (
                    <p className="text-sm text-destructive">{errors.new_quantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={data.batch}
                    onChange={(e) => setData('batch', e.target.value)}
                    className={errors.batch ? 'border-destructive' : ''}
                  />
                  {errors.batch && (
                    <p className="text-sm text-destructive">{errors.batch}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Adjustment</Label>
                <Textarea
                  id="reason"
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  className={errors.reason ? 'border-destructive' : ''}
                  rows={3}
                  placeholder="Enter the reason for this stock adjustment..."
                />
                {errors.reason && (
                  <p className="text-sm text-destructive">{errors.reason}</p>
                )}
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Please fix the errors above before submitting.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Adjusting...' : 'Adjust Stock'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/stock">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Adjustment Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Stock adjustments are used to correct inventory discrepancies. Use this feature when:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Physical count differs from system records</li>
              <li>Damaged or expired items need to be removed</li>
              <li>Found items need to be added to inventory</li>
              <li>Correcting data entry errors</li>
            </ul>
            <Alert>
              <WarningIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> All stock adjustments are logged and require a reason. 
                This helps maintain accurate inventory records and audit trails.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
