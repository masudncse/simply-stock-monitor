import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  SwapHoriz as SwapHorizIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { Link, router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Warehouse {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
  product: Product;
}

interface StockIndexProps {
  stocks: {
    data: Stock[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  warehouses: Warehouse[];
  products: Product[];
  filters: {
    warehouse_id?: number;
    product_id?: number;
    search?: string;
  };
}

export default function StockIndex({ stocks, warehouses, products, filters }: StockIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [warehouseFilter, setWarehouseFilter] = useState(filters.warehouse_id || '');
  const [productFilter, setProductFilter] = useState(filters.product_id || '');

  const handleSearch = () => {
    router.get('/stock', {
      search: search || undefined,
      warehouse_id: warehouseFilter || undefined,
      product_id: productFilter || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const isLowStock = (stock: Stock) => {
    return stock.qty <= stock.product.min_stock;
  };

  return (
    <Layout title="Stock Management">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Stock Management</Typography>
          <Box display="flex" gap={2}>
            <Button
              component={Link}
              href="/stock/low-stock"
              variant="outlined"
              startIcon={<WarningIcon />}
              color="warning"
            >
              Low Stock
            </Button>
            <Button
              component={Link}
              href="/stock/adjust"
              variant="outlined"
              startIcon={<TuneIcon />}
            >
              Adjust Stock
            </Button>
            <Button
              component={Link}
              href="/stock/transfer"
              variant="outlined"
              startIcon={<SwapHorizIcon />}
            >
              Transfer Stock
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Warehouse"
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
              >
                <MenuItem value="">All Warehouses</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Product"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              >
                <MenuItem value="">All Products</MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSearch}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stock Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell align="right">Cost Price</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stocks.data.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.product.name}</TableCell>
                      <TableCell>{stock.product.sku}</TableCell>
                      <TableCell>{stock.warehouse.name}</TableCell>
                      <TableCell align="right">{stock.qty}</TableCell>
                      <TableCell>{stock.batch || 'N/A'}</TableCell>
                      <TableCell align="right">${stock.cost_price.toFixed(2)}</TableCell>
                      <TableCell>
                        {stock.expiry_date ? new Date(stock.expiry_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isLowStock(stock) ? 'Low Stock' : 'In Stock'}
                          color={isLowStock(stock) ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {stocks.data.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No stock records found
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
