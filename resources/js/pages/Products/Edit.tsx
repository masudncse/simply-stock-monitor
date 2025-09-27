import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { update as updateRoute } from '@/routes/products';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id: number;
  unit: string;
  min_stock: number;
  price: number;
  cost_price: number;
  tax_rate: number;
  is_active: boolean;
}

interface ProductEditProps {
  product: Product;
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Edit Product',
        href: '#',
    },
];

export default function ProductEdit({ product, categories }: ProductEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    sku: product.sku,
    barcode: product.barcode || '',
    name: product.name,
    description: product.description || '',
    category_id: product.category_id,
    unit: product.unit,
    min_stock: product.min_stock,
    price: product.price,
    cost_price: product.cost_price,
    tax_rate: product.tax_rate,
    is_active: product.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(updateRoute.url({ product: product.id }));
  };

  return (
    <Layout title="Edit Product" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={data.sku}
                    onChange={(e) => setData('sku', e.target.value)}
                    className={errors.sku ? 'border-destructive' : ''}
                    required
                  />
                  {errors.sku && (
                    <p className="text-sm text-destructive">{errors.sku}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    className={errors.barcode ? 'border-destructive' : ''}
                  />
                  {errors.barcode && (
                    <p className="text-sm text-destructive">{errors.barcode}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className={errors.description ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={data.category_id.toString()} onValueChange={(value) => setData('category_id', parseInt(value))}>
                    <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && (
                    <p className="text-sm text-destructive">{errors.category_id}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="min_stock">Minimum Stock</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={data.min_stock}
                    onChange={(e) => setData('min_stock', parseFloat(e.target.value) || 0)}
                    className={errors.min_stock ? 'border-destructive' : ''}
                  />
                  {errors.min_stock && (
                    <p className="text-sm text-destructive">{errors.min_stock}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price *</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    value={data.cost_price}
                    onChange={(e) => setData('cost_price', parseFloat(e.target.value) || 0)}
                    className={errors.cost_price ? 'border-destructive' : ''}
                  />
                  {errors.cost_price && (
                    <p className="text-sm text-destructive">{errors.cost_price}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    value={data.tax_rate}
                    onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)}
                    className={errors.tax_rate ? 'border-destructive' : ''}
                  />
                  {errors.tax_rate && (
                    <p className="text-sm text-destructive">{errors.tax_rate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active" className="text-sm font-normal">
                      Active
                    </Label>
                  </div>
                </div>
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
                  {processing ? 'Updating...' : 'Update Product'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
