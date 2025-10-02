import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit as EditIcon, ArrowLeft as ArrowBackIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { edit as editRoute } from '@/routes/products';
import { BarcodeDisplay } from '@/components/BarcodeDisplay';

interface Warehouse {
  id: number;
  name: string;
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
}

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
  unit: string;
  min_stock: number;
  price: number;
  cost_price: number;
  tax_rate: number;
  is_active: boolean;
  category: Category;
  stocks: Stock[];
}

interface ProductShowProps {
  product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
  const totalStock = product.stocks.reduce((sum, stock) => sum + stock.qty, 0);
  const isLowStock = totalStock <= product.min_stock;

  return (
    <Layout title={`Product: ${product.name} - View product details and inventory`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">
              Product details and stock information
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={editRoute.url({ product: product.id })}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowBackIcon className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">{product.barcode || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unit</p>
                  <p className="font-medium">{product.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cost Price</p>
                  <p className="font-medium">${product.cost_price.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tax Rate</p>
                  <p className="font-medium">{product.tax_rate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              {product.description && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Stock Information</CardTitle>
                <Badge variant={isLowStock ? "destructive" : "default"}>
                  {isLowStock ? 'Low Stock' : 'In Stock'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold">{totalStock} {product.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                  <p className="text-lg font-medium">{product.min_stock} {product.unit}</p>
                </div>
              </div>

              {product.stocks.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Warehouse</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-right">Cost Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.stocks.map((stock) => (
                        <TableRow key={stock.id}>
                          <TableCell className="font-medium">{stock.warehouse.name}</TableCell>
                          <TableCell className="text-right">{stock.qty}</TableCell>
                          <TableCell>{stock.batch || 'N/A'}</TableCell>
                          <TableCell className="text-right">${stock.cost_price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No stock information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
