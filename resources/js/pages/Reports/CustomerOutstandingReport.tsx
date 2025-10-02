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
  Users as PeopleIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  AlertTriangle as WarningIcon,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface CustomerOutstanding {
  customer: {
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

interface CustomerOutstandingReportProps {
  customers: CustomerOutstanding[];
  totalOutstanding: number;
  filters: {
    customer_id?: number;
  };
}

const CustomerOutstandingReport: React.FC<CustomerOutstandingReportProps> = ({
  customers = [],
  totalOutstanding = 0,
  filters = {},
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Ensure customers is always an array
  const customerList = Array.isArray(customers) ? customers : [];

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/customer-outstanding', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/customer-outstanding', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'customer-outstanding',
      data: customerList as any,
    });
  };

  const getCreditStatus = (customer: CustomerOutstanding) => {
    const creditUtilization = (customer.outstanding_amount / customer.credit_limit) * 100;
    
    if (creditUtilization >= 90) {
      return { label: 'Critical', color: 'error' as const };
    } else if (creditUtilization >= 75) {
      return { label: 'High', color: 'warning' as const };
    } else if (creditUtilization >= 50) {
      return { label: 'Medium', color: 'info' as const };
    } else {
      return { label: 'Low', color: 'success' as const };
    }
  };

  return (
    <Layout title="Customer Outstanding Report">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <PeopleIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Customer Outstanding Report</h1>
          </div>
          <p className="text-muted-foreground">
            Outstanding receivables and credit limit analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customerList.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-destructive">${totalOutstanding.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Critical Credit</p>
                <p className="text-2xl font-bold text-destructive">
                  {customerList.filter(c => {
                    const utilization = (c.outstanding_amount / c.credit_limit) * 100;
                    return utilization >= 90;
                  }).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Avg Outstanding</p>
                <p className="text-2xl font-bold">
                  ${customerList.length > 0 ? (totalOutstanding / customerList.length).toFixed(2) : '0.00'}
                </p>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select 
                  value={localFilters.customer_id?.toString() || "all"} 
                  onValueChange={(value) => handleFilterChange('customer_id', value === "all" ? "" : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customerList.map((item) => (
                      <SelectItem key={item.customer.id} value={item.customer.id.toString()}>
                        {item.customer.name}
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
            Customer Outstanding Details ({customerList.length} customers)
          </h2>
          <Button onClick={exportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Customer Outstanding Table */}
        <Card>
          <CardContent>
            {customerList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Alert>
                  <AlertDescription>
                    No outstanding amounts found for the selected filters.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
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
                    {customerList.map((item) => {
                      const creditUtilization = (item.outstanding_amount / item.credit_limit) * 100;
                      const status = getCreditStatus(item);
                      
                      return (
                        <TableRow key={item.customer.id}>
                          <TableCell>{item.customer.name}</TableCell>
                          <TableCell>{item.customer.code}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {item.customer.email && (
                                <p className="text-sm text-muted-foreground">
                                  {item.customer.email}
                                </p>
                              )}
                              {item.customer.phone && (
                                <p className="text-sm text-muted-foreground">
                                  {item.customer.phone}
                                </p>
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
                            <span className={item.available_credit >= 0 ? 'text-green-600 font-medium' : 'text-destructive font-medium'}>
                              ${item.available_credit.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={creditUtilization >= 90 ? 'text-destructive' : creditUtilization >= 75 ? 'text-orange-600' : 'text-muted-foreground'}>
                              {creditUtilization.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.color === 'error' ? 'destructive' : status.color === 'warning' ? 'secondary' : 'default'}>
                              {creditUtilization >= 90 && <WarningIcon className="mr-1 h-3 w-3" />}
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Customers Alert */}
        {customerList.filter(c => {
          const utilization = (c.outstanding_amount / c.credit_limit) * 100;
          return utilization >= 90;
        }).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Credit Alert</AlertTitle>
            <AlertDescription>
              {customerList.filter(c => {
                const utilization = (c.outstanding_amount / c.credit_limit) * 100;
                return utilization >= 90;
              }).length} customer(s) have exceeded 90% of their credit limit. Immediate attention required.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default CustomerOutstandingReport;
