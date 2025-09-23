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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface POSProps {
  products: Product[];
}

export default function POS({ products }: POSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
      };
      setCart([...cart, newItem]);
    }
    setQuantity(1);
    setSelectedProduct(null);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total: item.unitPrice * newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.1; // 10% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const processSale = () => {
    if (cart.length === 0) return;

    const saleData = {
      customer_name: customerName || 'Walk-in Customer',
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      })),
      subtotal: getSubtotal(),
      tax_amount: getTax(),
      total_amount: getTotal(),
    };

    router.post('/sales', saleData, {
      onSuccess: () => {
        setCart([]);
        setCustomerName('');
        setPaymentDialogOpen(false);
      },
    });
  };

  return (
    <Layout title="Point of Sale">
      <Box>
        <Typography variant="h4" gutterBottom>
          Point of Sale
        </Typography>

        <Grid container spacing={3}>
          {/* Product Search and Selection */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Products
                </Typography>
                
                <TextField
                  fullWidth
                  label="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                  }}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            SKU: {product.sku}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {product.unit}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Cart */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Cart ({cart.length} items)
                  </Typography>
                </Box>

                {cart.length === 0 ? (
                  <Typography color="textSecondary" textAlign="center" py={4}>
                    No items in cart
                  </Typography>
                ) : (
                  <>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cart.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Typography variant="body2" noWrap>
                                  {item.product.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  ${item.unitPrice.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Typography variant="body2" sx={{ mx: 1 }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                ${item.total.toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Subtotal:</Typography>
                        <Typography>${getSubtotal().toFixed(2)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Tax (10%):</Typography>
                        <Typography>${getTax().toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">${getTotal().toFixed(2)}</Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<PaymentIcon />}
                        onClick={() => setPaymentDialogOpen(true)}
                        disabled={cart.length === 0}
                      >
                        Process Sale
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Product Selection Dialog */}
        <Dialog
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Add to Cart
          </DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  SKU: {selectedProduct.sku} | Price: ${selectedProduct.price.toFixed(2)}
                </Typography>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProduct(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedProduct && addToCart(selectedProduct)}
              variant="contained"
            >
              Add to Cart
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Process Payment
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cart.map((item) => (
              <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  {item.product.name} x {item.quantity}
                </Typography>
                <Typography variant="body2">
                  ${item.total.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${getTotal().toFixed(2)}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={processSale}
              variant="contained"
              color="success"
            >
              Complete Sale
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
