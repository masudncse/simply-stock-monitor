import React from 'react';
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
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

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
  category_id: number;
  unit: string;
  min_stock: number;
  price: number;
  cost_price: number;
  tax_rate: number;
  is_active: boolean;
}

interface ProductEditProps {
  product: Product;
  categories: Category[];
}

export default function ProductEdit({ product, categories }: ProductEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    sku: product.sku,
    barcode: product.barcode || '',
    name: product.name,
    description: product.description || '',
    category_id: product.category_id,
    unit: product.unit,
    min_stock: product.min_stock,
    price: product.price,
    cost_price: product.cost_price,
    tax_rate: product.tax_rate,
    is_active: product.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/products/${product.id}`);
  };

  return (
    <Layout title="Edit Product">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Edit Product</Typography>
          <Button
            component={Link}
            href="/products"
            variant="outlined"
          >
            Back to Products
          </Button>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SKU *"
                    value={data.sku}
                    onChange={(e) => setData('sku', e.target.value)}
                    error={!!errors.sku}
                    helperText={errors.sku}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Barcode"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    error={!!errors.barcode}
                    helperText={errors.barcode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name *"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.category_id}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={data.category_id}
                      onChange={(e) => setData('category_id', e.target.value)}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category_id && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.category_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                      label="Unit"
                    >
                      <MenuItem value="pcs">Pieces</MenuItem>
                      <MenuItem value="kg">Kilogram</MenuItem>
                      <MenuItem value="liter">Liter</MenuItem>
                      <MenuItem value="box">Box</MenuItem>
                      <MenuItem value="pack">Pack</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Minimum Stock"
                    type="number"
                    value={data.min_stock}
                    onChange={(e) => setData('min_stock', parseFloat(e.target.value) || 0)}
                    error={!!errors.min_stock}
                    helperText={errors.min_stock}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Selling Price *"
                    type="number"
                    step="0.01"
                    value={data.price}
                    onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                    error={!!errors.price}
                    helperText={errors.price}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Cost Price *"
                    type="number"
                    step="0.01"
                    value={data.cost_price}
                    onChange={(e) => setData('cost_price', parseFloat(e.target.value) || 0)}
                    error={!!errors.cost_price}
                    helperText={errors.cost_price}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    step="0.01"
                    value={data.tax_rate}
                    onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)}
                    error={!!errors.tax_rate}
                    helperText={errors.tax_rate}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                      />
                    }
                    label="Active"
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
                  {processing ? 'Updating...' : 'Update Product'}
                </Button>
                <Button
                  component={Link}
                  href="/products"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
