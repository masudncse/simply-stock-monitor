import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as ProcessIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute, process as processRoute } from '@/routes/sales';

interface Customer {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  unit: string;
}

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  customer: Customer;
  warehouse: Warehouse;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  notes?: string;
  sale_items: SaleItem[];
  created_by: User;
  created_at: string;
  updated_at: string;
}

interface SalesShowProps {
  sale: Sale;
}

export default function SalesShow({ sale }: SalesShowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'partial':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleProcess = () => {
    router.post(processRoute.url({ sale: sale.id }));
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Sale Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => router.visit(indexRoute.url())}
            >
              Back
            </Button>
            {sale.status === 'pending' && (
              <>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => router.visit(editRoute.url({ sale: sale.id }))}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ProcessIcon />}
                  onClick={handleProcess}
                >
                  Process Sale
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Sale Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sale Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sale.invoice_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={sale.status}
                      color={getStatusColor(sale.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Sale Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={sale.payment_status}
                      color={getPaymentStatusColor(sale.payment_status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {sale.notes || 'No notes'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sale.customer.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">
                      {sale.customer.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Contact Person
                    </Typography>
                    <Typography variant="body1">
                      {sale.customer.contact_person || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {sale.customer.phone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {sale.customer.email || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {sale.customer.address || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Warehouse Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Warehouse Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sale.warehouse.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">
                      {sale.warehouse.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {sale.warehouse.address || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sale Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sale Items
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        <TableCell>Batch</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sale.sale_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.product.sku}</TableCell>
                          <TableCell>{item.product.unit}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell align="right">${item.total_price.toFixed(2)}</TableCell>
                          <TableCell>{item.batch || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Totals */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal:</Typography>
                      <Typography>${sale.subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Tax Amount:</Typography>
                      <Typography>${sale.tax_amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Discount Amount:</Typography>
                      <Typography>${sale.discount_amount.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6">${sale.total_amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Paid Amount:</Typography>
                      <Typography>${sale.paid_amount.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Created By */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Created By
                    </Typography>
                    <Typography variant="body1">
                      {sale.created_by.name} ({sale.created_by.email})
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(sale.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
