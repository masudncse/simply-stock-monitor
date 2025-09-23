import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface StockAdjustProps {
  products: Product[];
  warehouses: Warehouse[];
}

export default function StockAdjust({ products, warehouses }: StockAdjustProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    warehouse_id: '',
    new_quantity: 0,
    batch: '',
    reason: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentStock, setCurrentStock] = useState<number>(0);

  const handleProductChange = (productId: string) => {
    setData('product_id', productId);
    const product = products.find(p => p.id.toString() === productId);
    setSelectedProduct(product || null);
    // In a real app, you'd fetch current stock from API
    setCurrentStock(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/stock/adjust', {
      onSuccess: () => {
        reset();
        setSelectedProduct(null);
        setCurrentStock(0);
      },
    });
  };

  return (
    <Layout title="Adjust Stock">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Adjust Stock</Typography>
          <Button
            component={Link}
            href="/stock"
            variant="outlined"
          >
            Back to Stock
          </Button>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.product_id}>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={data.product_id}
                      onChange={(e) => handleProductChange(e.target.value)}
                      label="Product"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.product_id && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.product_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.warehouse_id}>
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      value={data.warehouse_id}
                      onChange={(e) => setData('warehouse_id', e.target.value)}
                      label="Warehouse"
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.warehouse_id && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.warehouse_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {selectedProduct && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Current Stock:</strong> {currentStock} units
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Quantity *"
                    type="number"
                    step="0.01"
                    value={data.new_quantity}
                    onChange={(e) => setData('new_quantity', parseFloat(e.target.value) || 0)}
                    error={!!errors.new_quantity}
                    helperText={errors.new_quantity}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Batch Number"
                    value={data.batch}
                    onChange={(e) => setData('batch', e.target.value)}
                    error={!!errors.batch}
                    helperText={errors.batch}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Adjustment"
                    multiline
                    rows={3}
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    error={!!errors.reason}
                    helperText={errors.reason}
                    placeholder="Enter the reason for this stock adjustment..."
                  />
                </Grid>
              </Grid>

              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Please fix the errors above before submitting.
                </Alert>
              )}

              <Box mt={3} display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={processing}
                >
                  {processing ? 'Adjusting...' : 'Adjust Stock'}
                </Button>
                <Button
                  component={Link}
                  href="/stock"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Adjustment Guidelines
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Stock adjustments are used to correct inventory discrepancies. Use this feature when:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" color="textSecondary">
                Physical count differs from system records
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Damaged or expired items need to be removed
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Found items need to be added to inventory
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Correcting data entry errors
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Important:</strong> All stock adjustments are logged and require a reason. 
                This helps maintain accurate inventory records and audit trails.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
