import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Building2 as BusinessIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  Printer as PrintIcon,
  AlertTriangle as WarningIcon,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface SupplierOutstanding {
  supplier: {
    id: number;
    name: string;
    code: string;
    email?: string;
    phone?: string;
  };
  outstanding_amount: number;
  credit_limit: number;
  available_credit: number;
}

interface SupplierOutstandingReportProps {
  suppliers: SupplierOutstanding[];
  totalOutstanding: number;
  filters: {
    supplier_id?: number;
  };
}

const SupplierOutstandingReport: React.FC<SupplierOutstandingReportProps> = ({
  suppliers = [],
  totalOutstanding = 0,
  filters = {},
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Ensure suppliers is always an array
  const supplierList = Array.isArray(suppliers) ? suppliers : [];

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/supplier-outstanding', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/supplier-outstanding', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'supplier-outstanding',
      data: supplierList as any,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getCreditStatus = (supplier: SupplierOutstanding) => {
    const creditUtilization = (supplier.outstanding_amount / supplier.credit_limit) * 100;
    
    if (creditUtilization >= 90) {
      return { label: 'Critical', variant: 'destructive' as const };
    } else if (creditUtilization >= 75) {
      return { label: 'High', variant: 'default' as const };
    } else if (creditUtilization >= 50) {
      return { label: 'Medium', variant: 'secondary' as const };
    } else {
      return { label: 'Low', variant: 'success' as const };
    }
  };

  return (
    <Layout title="Supplier Outstanding Report">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BusinessIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Supplier Outstanding Report</h1>
          </div>
          <p className="text-muted-foreground">
            Outstanding payables and supplier credit analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <BusinessIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplierList.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">${totalOutstanding.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Credit</CardTitle>
              <WarningIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {supplierList.filter(s => {
                  const utilization = (s.outstanding_amount / s.credit_limit) * 100;
                  return utilization >= 90;
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Outstanding</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${supplierList.length > 0 ? (totalOutstanding / supplierList.length).toFixed(2) : '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="supplier_id">Supplier</Label>
                <Select
                  value={localFilters.supplier_id?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('supplier_id', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {supplierList.map((item) => (
                      <SelectItem key={item.supplier.id} value={item.supplier.id.toString()}>
                        {item.supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="default" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <PrintIcon className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={exportReport}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Outstanding Table */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Outstanding Details ({supplierList.length} suppliers)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Outstanding Amount</TableHead>
                    <TableHead className="text-right">Credit Limit</TableHead>
                    <TableHead className="text-right">Available Credit</TableHead>
                    <TableHead className="text-right">Credit Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierList.length > 0 ? (
                    supplierList.map((item) => {
                      const creditUtilization = (item.outstanding_amount / item.credit_limit) * 100;
                      const status = getCreditStatus(item);
                      
                      return (
                        <TableRow key={item.supplier.id}>
                          <TableCell className="font-medium">{item.supplier.name}</TableCell>
                          <TableCell>{item.supplier.code}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {item.supplier.email && (
                                <p className="text-sm text-muted-foreground">{item.supplier.email}</p>
                              )}
                              {item.supplier.phone && (
                                <p className="text-sm text-muted-foreground">{item.supplier.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-destructive font-medium">
                              ${item.outstanding_amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.credit_limit.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={item.available_credit >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                              ${item.available_credit.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={
                              creditUtilization >= 90 ? 'text-destructive font-medium' : 
                              creditUtilization >= 75 ? 'text-orange-600 font-medium' : 
                              'text-muted-foreground'
                            }>
                              {creditUtilization.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className={creditUtilization >= 90 ? 'gap-1' : ''}>
                              {creditUtilization >= 90 && <WarningIcon className="h-3 w-3" />}
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <Alert variant="default">
                          <AlertTitle>No Data</AlertTitle>
                          <AlertDescription>
                            No outstanding amounts found for the selected filters.
                          </AlertDescription>
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Critical Suppliers Alert */}
        {supplierList.filter(s => {
          const utilization = (s.outstanding_amount / s.credit_limit) * 100;
          return utilization >= 90;
        }).length > 0 && (
          <Alert variant="destructive">
            <WarningIcon className="h-4 w-4" />
            <AlertTitle>Critical Credit Alert</AlertTitle>
            <AlertDescription>
              {supplierList.filter(s => {
                const utilization = (s.outstanding_amount / s.credit_limit) * 100;
                return utilization >= 90;
              }).length} supplier(s) have exceeded 90% of their credit limit. Immediate attention required.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default SupplierOutstandingReport;
