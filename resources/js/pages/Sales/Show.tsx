import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Edit,
  CheckCircle,
  ArrowLeft,
  Printer,
  Check,
  Undo2,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute, process as processRoute, approve as approveRoute } from '@/routes/sales';
import CreateSaleReturnModal from '@/components/CreateSaleReturnModal';

interface Customer {
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

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  customer: Customer;
  warehouse: Warehouse;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  notes?: string;
  items: SaleItem[];
  created_by: User;
  created_at: string;
  updated_at: string;
}

interface SalesShowProps {
  sale: Sale;
}

export default function SalesShow({ sale }: SalesShowProps) {
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'partial':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleApprove = () => {
    router.post(approveRoute.url({ sale: sale.id }));
  };

  const handleProcess = () => {
    router.post(processRoute.url({ sale: sale.id }));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Sale Details
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.visit(indexRoute.url())}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {sale.status === 'draft' && (
              <>
                <Button
                  onClick={() => router.visit(editRoute.url({ sale: sale.id }))}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleProcess}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Sale
                </Button>
              </>
            )}
            {sale.status === 'pending' && (
              <>
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Sale
                </Button>
              </>
            )}
            {(sale.status === 'approved' || sale.status === 'completed') && (
              <Button
                variant="outline"
                onClick={() => setReturnModalOpen(true)}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Create Return
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.open(`/sales/${sale.id}/print`, '_blank')}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sale Information */}
          <Card>
            <CardHeader>
              <CardTitle>Sale Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-bold">{sale.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="text-xs">
                    {sale.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sale Date</p>
                  <p className="font-medium">{new Date(sale.sale_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant="outline" className="text-xs">
                    {sale.payment_status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{sale.notes || 'No notes'}</p>
                </div>
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
                  <p className="font-bold">{sale.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{sale.customer.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{sale.customer.contact_person || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{sale.customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{sale.customer.email || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{sale.customer.address || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Information */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-bold">{sale.warehouse.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{sale.warehouse.code}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{sale.warehouse.address || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sale Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sale Items</CardTitle>
          </CardHeader>
          <CardContent>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sale.items || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.sku}</TableCell>
                    <TableCell>{item.product.unit}</TableCell>
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
        <Card className="mt-6">
          <CardContent>
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${sale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span>${sale.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount Amount:</span>
                  <span>${sale.discount_amount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>${sale.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>${sale.paid_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{sale.created_by.name} ({sale.created_by.email})</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(sale.created_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Return Modal */}
      <CreateSaleReturnModal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        sale={sale}
      />
    </Layout>
  );
}
