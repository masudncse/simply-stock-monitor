import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { transfer as transferRoute } from '@/routes/stock';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

interface StockTransferProps {
  products: Product[];
  warehouses: Warehouse[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Stock',
    href: '/stock',
  },
  {
    title: 'Transfer Stock',
    href: '#',
  },
];

export default function StockTransfer({ products, warehouses }: StockTransferProps) {
  const { data, setData, post, processing, errors } = useForm({
    product_id: '',
    from_warehouse_id: '',
    to_warehouse_id: '',
    quantity: 0,
    notes: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductChange = (productId: string) => {
    setData('product_id', productId);
    const product = products.find(p => p.id.toString() === productId);
    setSelectedProduct(product || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(transferRoute.url);
  };

  return (
    <Layout title="Transfer Stock" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transfer Stock</h1>
            <p className="text-muted-foreground">
              Move stock between warehouses
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/stock">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stock
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from_warehouse">From Warehouse *</Label>
                  <Select 
                    value={data.from_warehouse_id} 
                    onValueChange={(value) => setData('from_warehouse_id', value)}
                  >
                    <SelectTrigger className={errors.from_warehouse_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.from_warehouse_id && (
                    <p className="text-sm text-destructive">{errors.from_warehouse_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to_warehouse">To Warehouse *</Label>
                  <Select 
                    value={data.to_warehouse_id} 
                    onValueChange={(value) => setData('to_warehouse_id', value)}
                  >
                    <SelectTrigger className={errors.to_warehouse_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses
                        .filter(warehouse => warehouse.id.toString() !== data.from_warehouse_id)
                        .map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name} ({warehouse.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.to_warehouse_id && (
                    <p className="text-sm text-destructive">{errors.to_warehouse_id}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={data.quantity}
                  onChange={(e) => setData('quantity', parseFloat(e.target.value) || 0)}
                  className={errors.quantity ? 'border-destructive' : ''}
                  placeholder="Enter quantity to transfer"
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Optional notes for this transfer"
                />
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
                  {processing ? 'Transferring...' : 'Transfer Stock'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/stock">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
