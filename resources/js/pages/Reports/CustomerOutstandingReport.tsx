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
  customers,
  totalOutstanding,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

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
      data: customers,
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
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <PeopleIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Customer Outstanding Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Outstanding receivables and credit limit analysis
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h4">
                  {customers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Outstanding
                </Typography>
                <Typography variant="h4" color="error">
                  ${totalOutstanding.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Critical Credit
                </Typography>
                <Typography variant="h4" color="error">
                  {customers.filter(c => {
                    const utilization = (c.outstanding_amount / c.credit_limit) * 100;
                    return utilization >= 90;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Avg Outstanding
                </Typography>
                <Typography variant="h4">
                  ${customers.length > 0 ? (totalOutstanding / customers.length).toFixed(2) : '0.00'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Customer</InputLabel>
                <Select
                  value={localFilters.customer_id || ''}
                  onChange={(e) => handleFilterChange('customer_id', e.target.value)}
                  label="Customer"
                >
                  <MenuItem value="">All Customers</MenuItem>
                  {customers.map((item) => (
                    <MenuItem key={item.customer.id} value={item.customer.id}>
                      {item.customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={applyFilters} size="small">
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={clearFilters} size="small">
                  Clear
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportReport}
                size="small"
              >
                Export CSV
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Customer Outstanding Details ({customers.length} customers)
          </Typography>
        </Box>

        {/* Customer Outstanding Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="right">Outstanding Amount</TableCell>
                <TableCell align="right">Credit Limit</TableCell>
                <TableCell align="right">Available Credit</TableCell>
                <TableCell align="right">Credit Utilization</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((item) => {
                const creditUtilization = (item.outstanding_amount / item.credit_limit) * 100;
                const status = getCreditStatus(item);
                
                return (
                  <TableRow key={item.customer.id}>
                    <TableCell>{item.customer.name}</TableCell>
                    <TableCell>{item.customer.code}</TableCell>
                    <TableCell>
                      <Box>
                        {item.customer.email && (
                          <Typography variant="body2" color="text.secondary">
                            {item.customer.email}
                          </Typography>
                        )}
                        {item.customer.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {item.customer.phone}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" color="error">
                        ${item.outstanding_amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      ${item.credit_limit.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body1" 
                        color={item.available_credit >= 0 ? 'success.main' : 'error.main'}
                      >
                        ${item.available_credit.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={creditUtilization >= 90 ? 'error.main' : creditUtilization >= 75 ? 'warning.main' : 'text.secondary'}
                      >
                        {creditUtilization.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={creditUtilization >= 90 ? <WarningIcon /> : undefined}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {customers.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No outstanding amounts found for the selected filters.
          </Alert>
        )}

        {/* Critical Customers Alert */}
        {customers.filter(c => {
          const utilization = (c.outstanding_amount / c.credit_limit) * 100;
          return utilization >= 90;
        }).length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Critical Credit Alert
            </Typography>
            <Typography variant="body2">
              {customers.filter(c => {
                const utilization = (c.outstanding_amount / c.credit_limit) * 100;
                return utilization >= 90;
              }).length} customer(s) have exceeded 90% of their credit limit. Immediate attention required.
            </Typography>
          </Alert>
        )}
      </Container>
    </Layout>
  );
};

export default CustomerOutstandingReport;
