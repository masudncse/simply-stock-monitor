import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft as BackIcon,
  Edit as EditIcon,
  Building2 as WarehouseIcon,
  Package as StockIcon,
  ShoppingCart as PurchaseIcon,
  ShoppingBag as SaleIcon,
  Mail as EmailIcon,
  Phone as PhoneIcon,
  User as UserIcon,
  MapPin as LocationIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stocks?: Array<{
    id: number;
    qty: number;
    product: {
      id: number;
      name: string;
      sku: string;
    };
  }>;
  purchases?: Array<{
    id: number;
    invoice_number: string;
    total_amount: number;
    status: string;
    purchase_date: string;
  }>;
  sales?: Array<{
    id: number;
    invoice_number: string;
    total_amount: number;
    status: string;
    sale_date: string;
  }>;
}

interface ShowWarehouseProps {
  warehouse: Warehouse;
}


export default function ShowWarehouse({ warehouse }: ShowWarehouseProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`)) {
      router.delete(`/warehouses/${warehouse.id}`, {
        onSuccess: () => {
          // Redirect will be handled by the controller
        },
        onError: (errors) => {
          console.error('Delete failed:', errors);
        }
      });
    }
  };

  const totalStockValue = warehouse.stocks?.reduce((sum, stock) => {
    return sum + (stock.qty * (stock.product.cost_price || 0));
  }, 0) || 0;

  const totalPurchases = warehouse.purchases?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0;
  const totalSales = warehouse.sales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

  return (
    <Layout title="Warehouse Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WarehouseIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{warehouse.name}</h1>
              <p className="text-muted-foreground">
                Warehouse details and inventory information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/warehouses">
              <Button variant="outline">
                <BackIcon className="mr-2 h-4 w-4" />
                Back to Warehouses
              </Button>
            </Link>
            <Link href={`/warehouses/${warehouse.id}/edit`}>
              <Button>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Warehouse
              </Button>
            </Link>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {warehouse.code}
                  </Badge>
                  <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                    {warehouse.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {warehouse.address && (
                  <div className="flex items-start space-x-3">
                    <LocationIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{warehouse.address}</p>
                    </div>
                  </div>
                )}

                {warehouse.contact_person && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Contact Person</p>
                      <p className="text-muted-foreground">{warehouse.contact_person}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {warehouse.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{warehouse.phone}</p>
                    </div>
                  </div>
                )}

                {warehouse.email && (
                  <div className="flex items-center space-x-3">
                    <EmailIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{warehouse.email}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(warehouse.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
              <StockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouse.stocks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Different products in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <PurchaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPurchases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {warehouse.purchases?.length || 0} purchase orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <SaleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {warehouse.sales?.length || 0} sales orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Stock */}
        {warehouse.stocks && warehouse.stocks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Current Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouse.stocks.slice(0, 10).map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">
                          {stock.product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{stock.product.sku}</Badge>
                        </TableCell>
                        <TableCell>{stock.qty}</TableCell>
                        <TableCell>
                          <Badge variant={stock.qty > 0 ? "default" : "secondary"}>
                            {stock.qty > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {warehouse.stocks.length > 10 && (
                <div className="mt-4 text-center">
                  <Link href="/stock" className="text-sm text-primary hover:underline">
                    View all {warehouse.stocks.length} stock items
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        {(warehouse.purchases && warehouse.purchases.length > 0) || (warehouse.sales && warehouse.sales.length > 0) ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Purchases */}
            {warehouse.purchases && warehouse.purchases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {warehouse.purchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{purchase.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(purchase.purchase_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${purchase.total_amount.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Sales */}
            {warehouse.sales && warehouse.sales.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {warehouse.sales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{sale.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${sale.total_amount.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">
                            {sale.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <WarehouseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">
                This warehouse hasn't been used in any purchases or sales yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
