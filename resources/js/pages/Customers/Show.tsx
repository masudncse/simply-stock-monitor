import React from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Edit as EditIcon,
  ArrowLeft as BackIcon,
  DollarSign as DollarSignIcon,
  CreditCard as CreditCardIcon,
  CircleDollarSign as OutstandingIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Sale {
  id: number;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

interface Customer {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  credit_limit: number;
  outstanding_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sales: Sale[];
}

interface CustomersShowProps {
  customer: Customer;
}

export default function CustomersShow({ customer }: CustomersShowProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'success';
      case 'partial':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const availableCredit = customer.credit_limit - customer.outstanding_amount;

  return (
    <Layout title={`Customer Details - ${customer.name}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Details - {customer.name}</h1>
            <p className="text-muted-foreground">
              Detailed information about the customer
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit('/customers')}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
            <Button onClick={() => router.visit(`/customers/${customer.id}/edit`)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{customer.code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p>{customer.contact_person || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={customer.is_active ? 'success' : 'secondary'}>
                  {customer.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{customer.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{customer.email || 'N/A'}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{customer.address || 'N/A'}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Tax Number</p>
                <p>{customer.tax_number || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                </div>
                <p className="font-semibold text-lg">${customer.credit_limit.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <OutstandingIcon className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                </div>
                <p className="font-semibold text-lg text-destructive">${customer.outstanding_amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5 text-success" />
                  <p className="text-sm text-muted-foreground">Available Credit</p>
                </div>
                <p className="font-bold text-xl text-success">${availableCredit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.sales.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                        <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">${sale.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(sale.status)}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusVariant(sale.payment_status)}>
                            {sale.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() => router.visit(`/sales/${sale.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No sales found for this customer.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p>{new Date(customer.created_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p>{new Date(customer.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
