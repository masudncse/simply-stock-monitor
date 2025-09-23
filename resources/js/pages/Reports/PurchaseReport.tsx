import React, { useState } from 'react';
import { router } from '@inertiajs/react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

interface Purchase {
  id: number;
  invoice_number: string;
  purchase_date: string;
  due_date?: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  status: string;
  supplier: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface PurchaseReportProps {
  purchases: Purchase[];
  summary: {
    total_purchases: number;
    total_amount: number;
    total_tax: number;
    total_discount: number;
    net_amount: number;
  };
  suppliers: Array<{ id: number; name: string }>;
  warehouses: Array<{ id: number; name: string }>;
  filters: {
    date_from?: string;
    date_to?: string;
    supplier_id?: number;
    warehouse_id?: number;
  };
}

const PurchaseReport: React.FC<PurchaseReportProps> = ({
  purchases,
  summary,
  suppliers,
  warehouses,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/purchases', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/purchases', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'purchases',
      data: purchases,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <ShoppingBagIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Purchase Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Purchase analysis and supplier performance
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Purchases
                </Typography>
                <Typography variant="h4">
                  {summary.total_purchases}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h4">
                  ${summary.total_amount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Tax
                </Typography>
                <Typography variant="h4">
                  ${summary.total_tax.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Discount
                </Typography>
                <Typography variant="h4">
                  ${summary.total_discount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Net Amount
                </Typography>
                <Typography variant="h4" color="primary">
                  ${summary.net_amount.toFixed(2)}
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date From"
                value={localFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date To"
                value={localFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={localFilters.supplier_id || ''}
                  onChange={(e) => handleFilterChange('supplier_id', e.target.value)}
                  label="Supplier"
                >
                  <MenuItem value="">All Suppliers</MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Warehouse</InputLabel>
                <Select
                  value={localFilters.warehouse_id || ''}
                  onChange={(e) => handleFilterChange('warehouse_id', e.target.value)}
                  label="Warehouse"
                >
                  <MenuItem value="">All Warehouses</MenuItem>
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={applyFilters} size="small">
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={clearFilters} size="small">
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Purchase Details ({purchases.length} transactions)
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportReport}
          >
            Export CSV
          </Button>
        </Box>

        {/* Purchase Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.invoice_number}</TableCell>
                  <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {purchase.due_date ? new Date(purchase.due_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{purchase.supplier.name}</TableCell>
                  <TableCell>{purchase.warehouse.name}</TableCell>
                  <TableCell align="right">${purchase.total_amount.toFixed(2)}</TableCell>
                  <TableCell align="right">${purchase.tax_amount.toFixed(2)}</TableCell>
                  <TableCell align="right">${purchase.discount_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={purchase.status}
                      color={getStatusColor(purchase.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {purchases.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No purchase data found for the selected filters.
          </Alert>
        )}
      </Container>
    </Layout>
  );
};

export default PurchaseReport;
