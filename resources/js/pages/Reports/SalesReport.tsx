import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingCart as ShoppingCartIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Sale {
  id: number;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  status: string;
  payment_status: string;
  customer?: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface SalesReportProps {
  sales: Sale[];
  summary: {
    total_sales: number;
    total_amount: number;
    total_tax: number;
    total_discount: number;
    net_amount: number;
  };
  customers: Array<{ id: number; name: string }>;
  warehouses: Array<{ id: number; name: string }>;
  filters: {
    date_from?: string;
    date_to?: string;
    customer_id?: number;
    warehouse_id?: number;
  };
}

const SalesReport: React.FC<SalesReportProps> = ({
  sales,
  summary,
  customers,
  warehouses,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/sales', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/sales', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'sales',
      data: sales,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'unpaid':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout title="Sales Report - View sales performance and analytics">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCartIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
          </div>
          <p className="text-muted-foreground">
            Sales performance and revenue analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{summary.total_sales}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${summary.total_amount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Tax</p>
                <p className="text-2xl font-bold">${summary.total_tax.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Discount</p>
                <p className="text-2xl font-bold">${summary.total_discount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className="text-2xl font-bold text-primary">${summary.net_amount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="date_from">Date From</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_to">Date To</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <CustomerCombobox
                  value={localFilters.customer_id?.toString() || ""}
                  onValueChange={(value) => handleFilterChange('customer_id', value === "" ? "" : parseInt(value))}
                  placeholder="All Customers"
                  showAllOption={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={localFilters.warehouse_id?.toString() || "all"} onValueChange={(value) => handleFilterChange('warehouse_id', value === "all" ? "" : parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="default" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Sales Details ({sales.length} transactions)
          </h2>
          <Button onClick={exportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Sales Table */}
        <Card>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Alert>
                  <AlertDescription>
                    No sales data found for the selected filters.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                        <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.customer?.name || 'Walk-in'}</TableCell>
                        <TableCell>{sale.warehouse.name}</TableCell>
                        <TableCell className="text-right">${sale.total_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${sale.tax_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${sale.discount_amount.toFixed(2)}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SalesReport;