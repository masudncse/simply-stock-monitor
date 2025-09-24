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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { update as updateRoute, show as showRoute } from '@/routes/purchases';

interface Supplier {
  id: number;
  name: string;
  code: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
  category: {
    id: number;
    name: string;
  };
}

interface PurchaseItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  expiry_date: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  supplier_id: number;
  warehouse_id: number;
  purchase_date: string;
  due_date?: string;
  notes?: string;
  items: PurchaseItem[];
}

interface PurchasesEditProps {
  purchase: Purchase;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  products: Product[];
}

export default function PurchasesEdit({ purchase, suppliers, warehouses, products }: PurchasesEditProps) {
  const [formData, setFormData] = useState({
    supplier_id: purchase.supplier_id.toString(),
    warehouse_id: purchase.warehouse_id.toString(),
    purchase_date: purchase.purchase_date,
    due_date: purchase.due_date || '',
    notes: purchase.notes || '',
  });

  const [items, setItems] = useState<PurchaseItem[]>(purchase.items);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newItem, setNewItem] = useState({
    quantity: 1,
    unit_price: 0,
    batch: '',
    expiry_date: '',
  });

  const addItem = () => {
    if (!selectedProduct) return;

    const totalPrice = newItem.quantity * newItem.unit_price;
    const item: PurchaseItem = {
      product_id: selectedProduct.id,
      product: selectedProduct,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      total_price: totalPrice,
      batch: newItem.batch,
      expiry_date: newItem.expiry_date,
    };

    setItems([...items, item]);
    setSelectedProduct(null);
    setNewItem({
      quantity: 1,
      unit_price: 0,
      batch: '',
      expiry_date: '',
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const { subtotal, taxAmount, totalAmount } = calculateTotals();

    router.put(updateRoute.url({ purchase: purchase.id }), {
      ...formData,
      items,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: 0,
      total_amount: totalAmount,
    });
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Edit Purchase - {purchase.invoice_number}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.visit(showRoute.url({ purchase: purchase.id }))}
          >
            Back to Purchase
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Purchase Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Purchase Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Supplier</InputLabel>
                        <Select
                          value={formData.supplier_id}
                          label="Supplier"
                          onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                        >
                          {suppliers.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name} ({supplier.code})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Warehouse</InputLabel>
                        <Select
                          value={formData.warehouse_id}
                          label="Warehouse"
                          onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                        >
                          {warehouses.map((warehouse) => (
                            <MenuItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Purchase Date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Add Items */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Add Items
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(option) => `${option.name} (${option.sku})`}
                        value={selectedProduct}
                        onChange={(_, newValue) => {
                          setSelectedProduct(newValue);
                          if (newValue) {
                            setNewItem({ ...newItem, unit_price: newValue.price });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Product" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                        inputProps={{ min: 0.01, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Unit Price"
                        type="number"
                        value={newItem.unit_price}
                        onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Batch"
                        value={newItem.batch}
                        onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        value={newItem.expiry_date}
                        onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addItem}
                        disabled={!selectedProduct || newItem.quantity <= 0 || newItem.unit_price <= 0}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Items Table */}
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
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Total Price</TableCell>
                          <TableCell>Batch</TableCell>
                          <TableCell>Expiry Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product?.name}</TableCell>
                            <TableCell>{item.product?.sku}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                inputProps={{ min: 0.01, step: 0.01 }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                inputProps={{ min: 0, step: 0.01 }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>${item.total_price.toFixed(2)}</TableCell>
                            <TableCell>
                              <TextField
                                value={item.batch}
                                onChange={(e) => updateItem(index, 'batch', e.target.value)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="date"
                                value={item.expiry_date}
                                onChange={(e) => updateItem(index, 'expiry_date', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="error"
                                onClick={() => removeItem(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
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
                        <Typography>${totals.subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Tax (10%):</Typography>
                        <Typography>${totals.taxAmount.toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">${totals.totalAmount.toFixed(2)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.visit(showRoute.url({ purchase: purchase.id }))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={items.length === 0}
                >
                  Update Purchase
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}
