import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
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
  suppliers,
  totalOutstanding,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: any) => {
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
      data: suppliers,
    });
  };

  const getCreditStatus = (supplier: SupplierOutstanding) => {
    const creditUtilization = (supplier.outstanding_amount / supplier.credit_limit) * 100;
    
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
            <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Supplier Outstanding Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Outstanding payables and supplier credit analysis
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Suppliers
                </Typography>
                <Typography variant="h4">
                  {suppliers.length}
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
                  {suppliers.filter(s => {
                    const utilization = (s.outstanding_amount / s.credit_limit) * 100;
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
                  ${suppliers.length > 0 ? (totalOutstanding / suppliers.length).toFixed(2) : '0.00'}
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
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={localFilters.supplier_id || ''}
                  onChange={(e) => handleFilterChange('supplier_id', e.target.value)}
                  label="Supplier"
                >
                  <MenuItem value="">All Suppliers</MenuItem>
                  {suppliers.map((item) => (
                    <MenuItem key={item.supplier.id} value={item.supplier.id}>
                      {item.supplier.name}
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
            Supplier Outstanding Details ({suppliers.length} suppliers)
          </Typography>
        </Box>

        {/* Supplier Outstanding Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
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
              {suppliers.map((item) => {
                const creditUtilization = (item.outstanding_amount / item.credit_limit) * 100;
                const status = getCreditStatus(item);
                
                return (
                  <TableRow key={item.supplier.id}>
                    <TableCell>{item.supplier.name}</TableCell>
                    <TableCell>{item.supplier.code}</TableCell>
                    <TableCell>
                      <Box>
                        {item.supplier.email && (
                          <Typography variant="body2" color="text.secondary">
                            {item.supplier.email}
                          </Typography>
                        )}
                        {item.supplier.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {item.supplier.phone}
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

        {suppliers.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No outstanding amounts found for the selected filters.
          </Alert>
        )}

        {/* Critical Suppliers Alert */}
        {suppliers.filter(s => {
          const utilization = (s.outstanding_amount / s.credit_limit) * 100;
          return utilization >= 90;
        }).length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Critical Credit Alert
            </Typography>
            <Typography variant="body2">
              {suppliers.filter(s => {
                const utilization = (s.outstanding_amount / s.credit_limit) * 100;
                return utilization >= 90;
              }).length} supplier(s) have exceeded 90% of their credit limit. Immediate attention required.
            </Typography>
          </Alert>
        )}
      </Container>
    </Layout>
  );
};

export default SupplierOutstandingReport;
