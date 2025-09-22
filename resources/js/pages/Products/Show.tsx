import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Warehouse {
  id: number;
  name: string;
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  unit: string;
  min_stock: number;
  price: number;
  cost_price: number;
  tax_rate: number;
  is_active: boolean;
  category: Category;
  stocks: Stock[];
}

interface ProductShowProps {
  product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
  const totalStock = product.stocks.reduce((sum, stock) => sum + stock.qty, 0);
  const isLowStock = totalStock <= product.min_stock;

  return (
    <Layout title={`Product: ${product.name}`}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">{product.name}</Typography>
          <Box display="flex" gap={2}>
            <Button
              component={Link}
              href={`/products/${product.id}/edit`}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Product
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Back to Products
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      SKU
                    </Typography>
                    <Typography variant="body1">{product.sku}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Barcode
                    </Typography>
                    <Typography variant="body1">
                      {product.barcode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{product.category.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Unit
                    </Typography>
                    <Typography variant="body1">{product.unit}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Selling Price
                    </Typography>
                    <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Cost Price
                    </Typography>
                    <Typography variant="body1">${product.cost_price.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Tax Rate
                    </Typography>
                    <Typography variant="body1">{product.tax_rate}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={product.is_active ? 'Active' : 'Inactive'}
                      color={product.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  {product.description && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Description
                      </Typography>
                      <Typography variant="body1">{product.description}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Stock Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Stock Information
                  </Typography>
                  <Chip
                    label={isLowStock ? 'Low Stock' : 'In Stock'}
                    color={isLowStock ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>
                
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Stock
                    </Typography>
                    <Typography variant="h6">{totalStock} {product.unit}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Minimum Stock
                    </Typography>
                    <Typography variant="body1">{product.min_stock} {product.unit}</Typography>
                  </Grid>
                </Grid>

                {product.stocks.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Warehouse</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell>Batch</TableCell>
                          <TableCell align="right">Cost Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.stocks.map((stock) => (
                          <TableRow key={stock.id}>
                            <TableCell>{stock.warehouse.name}</TableCell>
                            <TableCell align="right">{stock.qty}</TableCell>
                            <TableCell>{stock.batch || 'N/A'}</TableCell>
                            <TableCell align="right">${stock.cost_price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No stock information available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
