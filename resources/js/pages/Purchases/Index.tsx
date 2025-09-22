import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Supplier {
  id: number;
  name: string;
  code: string;
}

interface PurchaseItem {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
  expiry_date?: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  supplier: Supplier;
  warehouse: {
    id: number;
    name: string;
  };
  purchase_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  notes?: string;
  purchase_items: PurchaseItem[];
  created_at: string;
}

interface PurchasesIndexProps {
  purchases: {
    data: Purchase[];
    links: any[];
    meta: any;
  };
  suppliers: Supplier[];
  filters: {
    search?: string;
    status?: string;
    supplier_id?: number;
  };
}

export default function PurchasesIndex({ purchases, suppliers, filters }: PurchasesIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [supplierFilter, setSupplierFilter] = useState(filters.supplier_id || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(null);

  const handleSearch = () => {
    router.get(route('purchases.index'), {
      search: searchTerm,
      status: statusFilter,
      supplier_id: supplierFilter,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (purchase: Purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (purchaseToDelete) {
      router.delete(route('purchases.destroy', purchaseToDelete.id));
    }
    setDeleteDialogOpen(false);
    setPurchaseToDelete(null);
  };

  const handleApprove = (purchase: Purchase) => {
    router.post(route('purchases.approve', purchase.id));
  };

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

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Purchases
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.visit(route('purchases.create'))}
          >
            New Purchase
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={supplierFilter}
                    label="Supplier"
                    onChange={(e) => setSupplierFilter(e.target.value)}
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
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  sx={{ height: '56px' }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Purchases Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.data.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.invoice_number}</TableCell>
                      <TableCell>{purchase.supplier.name}</TableCell>
                      <TableCell>{purchase.warehouse.name}</TableCell>
                      <TableCell>
                        {new Date(purchase.purchase_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${purchase.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={purchase.status}
                          color={getStatusColor(purchase.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(route('purchases.show', purchase.id))}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(route('purchases.edit', purchase.id))}
                          >
                            <EditIcon />
                          </IconButton>
                          {purchase.status === 'pending' && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApprove(purchase)}
                            >
                              <ApproveIcon />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(purchase)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {purchases.links && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {purchases.links.map((link: any, index: number) => (
                  <Button
                    key={index}
                    variant={link.active ? 'contained' : 'outlined'}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={!link.url}
                    sx={{ mx: 0.5 }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete purchase {purchaseToDelete?.invoice_number}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
