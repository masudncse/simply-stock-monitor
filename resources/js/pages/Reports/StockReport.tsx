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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

interface Stock {
  id: number;
  qty: number;
  cost_price: number;
  batch?: string;
  expiry_date?: string;
  product: {
    id: number;
    name: string;
    sku: string;
    min_stock: number;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface StockReportProps {
  stocks: Stock[];
  totalValuation: number;
  warehouses: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  filters: {
    warehouse_id?: number;
    category_id?: number;
    low_stock?: boolean;
  };
}

const StockReport: React.FC<StockReportProps> = ({
  stocks,
  totalValuation,
  warehouses,
  categories,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/stock', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/stock', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'stock',
      data: stocks,
    });
  };

  const getStockStatus = (stock: Stock) => {
    if (stock.qty <= stock.product.min_stock) {
      return { label: 'Low Stock', color: 'error' as const };
    } else if (stock.qty <= stock.product.min_stock * 1.5) {
      return { label: 'Medium Stock', color: 'warning' as const };
    } else {
      return { label: 'Good Stock', color: 'success' as const };
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <InventoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Stock Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Current stock levels and valuation across all warehouses
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Products
                </Typography>
                <Typography variant="h4">
                  {stocks.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Valuation
                </Typography>
                <Typography variant="h4">
                  ${totalValuation.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Low Stock Items
                </Typography>
                <Typography variant="h4" color="error">
                  {stocks.filter(stock => stock.qty <= stock.product.min_stock).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Warehouses
                </Typography>
                <Typography variant="h4">
                  {warehouses.length}
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={localFilters.category_id || ''}
                  onChange={(e) => handleFilterChange('category_id', e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={localFilters.low_stock ? 'low' : ''}
                  onChange={(e) => handleFilterChange('low_stock', e.target.value === 'low')}
                  label="Stock Status"
                >
                  <MenuItem value="">All Stock</MenuItem>
                  <MenuItem value="low">Low Stock Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            Stock Details ({stocks.length} items)
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportReport}
          >
            Export CSV
          </Button>
        </Box>

        {/* Stock Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Min Stock</TableCell>
                <TableCell align="right">Cost Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => {
                const status = getStockStatus(stock);
                return (
                  <TableRow key={`${stock.product.id}-${stock.warehouse.id}`}>
                    <TableCell>{stock.product.name}</TableCell>
                    <TableCell>{stock.product.sku}</TableCell>
                    <TableCell>{stock.warehouse.name}</TableCell>
                    <TableCell align="right">{stock.qty}</TableCell>
                    <TableCell align="right">{stock.product.min_stock}</TableCell>
                    <TableCell align="right">${stock.cost_price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      ${(stock.qty * stock.cost_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{stock.batch || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {stocks.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No stock data found for the selected filters.
          </Alert>
        )}
      </Container>
    </Layout>
  );
};

export default StockReport;
