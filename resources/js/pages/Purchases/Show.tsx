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
  CheckCircle as ApproveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute } from '@/routes/purchases';

interface Supplier {
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

interface PurchaseItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
  expiry_date?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  supplier: Supplier;
  warehouse: Warehouse;
  purchase_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  notes?: string;
  items: PurchaseItem[];
  created_by: User;
  created_at: string;
  updated_at: string;
}

interface PurchasesShowProps {
  purchase: Purchase;
}

export default function PurchasesShow({ purchase }: PurchasesShowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleApprove = () => {
    router.post(`/purchases/${purchase.id}/approve`);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Purchase Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => router.visit(indexRoute.url())}
            >
              Back
            </Button>
            {purchase.status === 'pending' && (
              <>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => router.visit(editRoute.url({ purchase: purchase.id }))}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Purchase Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Purchase Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {purchase.invoice_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={purchase.status}
                      color={getStatusColor(purchase.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Purchase Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1">
                      {purchase.due_date ? new Date(purchase.due_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {purchase.notes || 'No notes'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Supplier Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Supplier Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {purchase.supplier.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">
                      {purchase.supplier.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Contact Person
                    </Typography>
                    <Typography variant="body1">
                      {purchase.supplier.contact_person || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {purchase.supplier.phone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {purchase.supplier.email || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {purchase.supplier.address || 'N/A'}
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
                      {purchase.warehouse.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">
                      {purchase.warehouse.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {purchase.warehouse.address || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Purchase Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Purchase Items
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
                        <TableCell>Expiry Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchase.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.product.sku}</TableCell>
                          <TableCell>{item.product.unit}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell align="right">${item.total_price.toFixed(2)}</TableCell>
                          <TableCell>{item.batch || 'N/A'}</TableCell>
                          <TableCell>
                            {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                          </TableCell>
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
                      <Typography>${purchase.subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Tax Amount:</Typography>
                      <Typography>${purchase.tax_amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Discount Amount:</Typography>
                      <Typography>${purchase.discount_amount.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6">${purchase.total_amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Paid Amount:</Typography>
                      <Typography>${purchase.paid_amount.toFixed(2)}</Typography>
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
                      {purchase.created_by.name} ({purchase.created_by.email})
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(purchase.created_at).toLocaleString()}
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
