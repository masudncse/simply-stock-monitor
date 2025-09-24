import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as stockIndexRoute } from '@/routes/stock';

interface Warehouse {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  min_stock: number;
  stocks: Stock[];
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
}

interface LowStockProps {
  products: Product[];
}

export default function LowStock({ products }: LowStockProps) {
  const getTotalStock = (stocks: Stock[]) => {
    return stocks.reduce((total, stock) => total + stock.qty, 0);
  };

  const getStockStatus = (product: Product) => {
    const totalStock = getTotalStock(product.stocks);
    if (totalStock === 0) {
      return { label: 'Out of Stock', color: 'error' as const };
    } else if (totalStock <= product.min_stock) {
      return { label: 'Low Stock', color: 'warning' as const };
    }
    return { label: 'In Stock', color: 'success' as const };
  };

  return (
    <Layout title="Low Stock Products">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Low Stock Products
            </Typography>
          </Box>
          <Button
            component={Link}
            href={stockIndexRoute.url()}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back to Stock
          </Button>
        </Box>

        {products.length === 0 ? (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <InventoryIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main" gutterBottom>
                  All products are well stocked!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No products are currently below their minimum stock levels.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {products.length} product{products.length !== 1 ? 's' : ''} {products.length === 1 ? 'is' : 'are'} below minimum stock level
              </Typography>
              <Typography variant="body2">
                Consider reordering these products to maintain adequate inventory levels.
              </Typography>
            </Alert>

            <Card>
              <CardContent>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="center">Min Stock</TableCell>
                        <TableCell align="center">Current Stock</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Warehouses</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => {
                        const totalStock = getTotalStock(product.stocks);
                        const status = getStockStatus(product);
                        
                        return (
                          <TableRow key={product.id} hover>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {product.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {product.sku}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="medium">
                                {product.min_stock}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography 
                                variant="body2" 
                                fontWeight="medium"
                                color={totalStock === 0 ? 'error.main' : totalStock <= product.min_stock ? 'warning.main' : 'success.main'}
                              >
                                {totalStock}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={status.label}
                                color={status.color}
                                size="small"
                                icon={status.color === 'error' ? <WarningIcon /> : undefined}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {product.stocks.map((stock) => (
                                  <Chip
                                    key={stock.id}
                                    label={`${stock.warehouse.name}: ${stock.qty}`}
                                    size="small"
                                    variant="outlined"
                                    color={stock.qty === 0 ? 'error' : stock.qty <= product.min_stock ? 'warning' : 'default'}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Layout>
  );
}
