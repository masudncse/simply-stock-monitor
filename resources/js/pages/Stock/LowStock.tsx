import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft as ArrowBackIcon,
  AlertTriangle as WarningIcon,
  Package as InventoryIcon,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as stockIndexRoute } from '@/routes/stock';

interface Warehouse {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  min_stock: number;
  stocks: Stock[];
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
}

interface LowStockProps {
  products: Product[];
}

export default function LowStock({ products }: LowStockProps) {
  const getTotalStock = (stocks: Stock[]) => {
    return stocks.reduce((total, stock) => total + stock.qty, 0);
  };

  const getStockStatus = (product: Product) => {
    const totalStock = getTotalStock(product.stocks);
    if (totalStock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (totalStock <= product.min_stock) {
      return { label: 'Low Stock', variant: 'secondary' as const };
    }
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <Layout title="Low Stock Products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <WarningIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Low Stock Products</h1>
              <p className="text-muted-foreground">
                Products that need immediate attention
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={stockIndexRoute.url()}>
              <ArrowBackIcon className="mr-2 h-4 w-4" />
              Back to Stock
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="p-4 bg-green-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <InventoryIcon className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  All products are well stocked!
                </h3>
                <p className="text-muted-foreground">
                  No products are currently below their minimum stock levels.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert>
              <WarningIcon className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {products.length} product{products.length !== 1 ? 's' : ''} {products.length === 1 ? 'is' : 'are'} below minimum stock level
                  </p>
                  <p className="text-sm">
                    Consider reordering these products to maintain adequate inventory levels.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-center">Min Stock</TableHead>
                        <TableHead className="text-center">Current Stock</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Warehouses</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const totalStock = getTotalStock(product.stocks);
                        const status = getStockStatus(product);
                        
                        return (
                          <TableRow key={product.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">{product.sku}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="font-medium">{product.min_stock}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div 
                                className={`font-medium ${
                                  totalStock === 0 
                                    ? 'text-destructive' 
                                    : totalStock <= product.min_stock 
                                    ? 'text-orange-600' 
                                    : 'text-green-600'
                                }`}
                              >
                                {totalStock}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={status.variant}>
                                {status.variant === 'destructive' && (
                                  <WarningIcon className="mr-1 h-3 w-3" />
                                )}
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {product.stocks.map((stock) => (
                                  <Badge
                                    key={stock.id}
                                    variant="outline"
                                    className={
                                      stock.qty === 0 
                                        ? 'border-destructive text-destructive' 
                                        : stock.qty <= product.min_stock 
                                        ? 'border-orange-500 text-orange-600' 
                                        : ''
                                    }
                                  >
                                    {stock.warehouse.name}: {stock.qty}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
