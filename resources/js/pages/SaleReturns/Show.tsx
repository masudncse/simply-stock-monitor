import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  Edit,
  Check,
  Trash2,
  Printer,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute, approve as approveRoute, destroy as destroyRoute } from '@/routes/sale-returns';

interface SaleReturn {
  id: number;
  return_number: string;
  sale: {
    id: number;
    invoice_number: string;
  };
  customer: {
    id: number;
    name: string;
    code: string;
  } | null;
  warehouse: {
    id: number;
    name: string;
  };
  return_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  reason?: string;
  notes?: string;
  items: {
    id: number;
    product: {
      id: number;
      name: string;
      sku: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
    batch?: string;
  }[];
  created_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface SaleReturnShowProps {
  saleReturn: SaleReturn;
}

export default function SaleReturnShow({ saleReturn }: SaleReturnShowProps) {
  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this return? Stock will be adjusted.')) {
      router.post(approveRoute.url({ saleReturn: saleReturn.id }));
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this return?')) {
      router.delete(destroyRoute.url({ saleReturn: saleReturn.id }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout title={`Sale Return ${saleReturn.return_number} - View Details`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sale Return Details</h1>
            <p className="text-muted-foreground">
              Credit Note: {saleReturn.return_number}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {saleReturn.status === 'draft' && (
              <>
                <Button onClick={() => router.visit(editRoute.url({ saleReturn: saleReturn.id }))}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Approve Return
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => window.open(`/sale-returns/${saleReturn.id}/print`, '_blank')}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Return Information */}
          <Card>
            <CardHeader>
              <CardTitle>Return Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Return Number</p>
                  <p className="font-bold">{saleReturn.return_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(saleReturn.status)}>
                    {saleReturn.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Original Sale</p>
                  <p className="font-medium">{saleReturn.sale.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Return Date</p>
                  <p className="font-medium">{new Date(saleReturn.return_date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{saleReturn.reason || 'N/A'}</p>
                </div>
                {saleReturn.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{saleReturn.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-bold">{saleReturn.customer?.name || 'Walk-in Customer'}</p>
                </div>
                {saleReturn.customer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Code</p>
                    <p className="font-medium">{saleReturn.customer.code}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Items */}
        <Card>
          <CardHeader>
            <CardTitle>Returned Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead>Batch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleReturn.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell>{item.product.sku}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total_price.toFixed(2)}</TableCell>
                    <TableCell>{item.batch || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${saleReturn.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span>${saleReturn.tax_amount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Credit Amount:</span>
                    <span>${saleReturn.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{saleReturn.created_by.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(saleReturn.created_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

