import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  ArrowLeft as BackIcon,
  Undo2 as ReturnIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute } from '@/routes/purchases';
import CreatePurchaseReturnModal from '@/components/CreatePurchaseReturnModal';

interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  unit: string;
}

interface PurchaseItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
  expiry_date?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  supplier: Supplier;
  warehouse: Warehouse;
  purchase_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  notes?: string;
  items: PurchaseItem[];
  created_by: User;
  created_at: string;
  updated_at: string;
}

interface PurchasesShowProps {
  purchase: Purchase;
}

export default function PurchasesShow({ purchase }: PurchasesShowProps) {
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleApprove = () => {
    router.post(`/purchases/${purchase.id}/approve`);
  };

  return (
    <Layout title="Purchase Details - View purchase order information and items">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchase Details</h1>
            <p className="text-muted-foreground">
              View purchase order information and items
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back
            </Button>
            {purchase.status === 'pending' && (
              <>
                <Button onClick={() => router.visit(editRoute.url({ purchase: purchase.id }))}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  <ApproveIcon className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {purchase.status === 'approved' && (
              <Button
                variant="outline"
                onClick={() => setReturnModalOpen(true)}
              >
                <ReturnIcon className="mr-2 h-4 w-4" />
                Create Return
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-semibold">{purchase.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusVariant(purchase.status)}>
                    {purchase.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p>{new Date(purchase.purchase_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p>{purchase.due_date ? new Date(purchase.due_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              {purchase.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{purchase.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{purchase.supplier.name}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p>{purchase.supplier.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p>{purchase.supplier.contact_person || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{purchase.supplier.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{purchase.supplier.email || 'N/A'}</p>
                </div>
              </div>
              {purchase.supplier.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{purchase.supplier.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warehouse Information */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{purchase.warehouse.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p>{purchase.warehouse.code}</p>
                </div>
              </div>
              {purchase.warehouse.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{purchase.warehouse.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p>{purchase.created_by.name} ({purchase.created_by.email})</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{new Date(purchase.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Items */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>{item.product.unit}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total_price.toFixed(2)}</TableCell>
                      <TableCell>{item.batch || 'N/A'}</TableCell>
                      <TableCell>
                        {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardContent>
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${purchase.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span>${purchase.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount Amount:</span>
                  <span>${purchase.discount_amount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>${purchase.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>${purchase.paid_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Return Modal */}
      <CreatePurchaseReturnModal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        purchase={purchase}
      />
    </Layout>
  );
}