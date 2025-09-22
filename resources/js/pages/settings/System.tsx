import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import {
  Tune as TuneIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

interface SystemSettingsProps {
  settings: {
    low_stock_threshold: number;
    auto_generate_invoice: boolean;
    require_approval_for_purchases: boolean;
    require_approval_for_sales: boolean;
    enable_barcode_scanning: boolean;
    enable_inventory_tracking: boolean;
    enable_multi_warehouse: boolean;
    default_tax_rate: number;
    default_currency: string;
    backup_frequency: string;
  };
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ settings }) => {
  const [formData, setFormData] = useState(settings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/settings/system', formData, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
  ];

  const backupFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <TuneIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            System Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure system behavior and operational settings
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Inventory Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Inventory Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Low Stock Threshold"
                        type="number"
                        value={formData.low_stock_threshold}
                        onChange={(e) => handleChange('low_stock_threshold', parseInt(e.target.value))}
                        helperText="Minimum quantity before low stock alert"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Default Tax Rate (%)"
                        type="number"
                        value={formData.default_tax_rate}
                        onChange={(e) => handleChange('default_tax_rate', parseFloat(e.target.value))}
                        helperText="Default tax rate for new products"
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.enable_inventory_tracking}
                          onChange={(e) => handleChange('enable_inventory_tracking', e.target.checked)}
                        />
                      }
                      label="Enable Inventory Tracking"
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.enable_multi_warehouse}
                          onChange={(e) => handleChange('enable_multi_warehouse', e.target.checked)}
                        />
                      }
                      label="Enable Multi-Warehouse Support"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Transaction Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction Settings
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.auto_generate_invoice}
                          onChange={(e) => handleChange('auto_generate_invoice', e.target.checked)}
                        />
                      }
                      label="Auto-generate Invoice Numbers"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.require_approval_for_purchases}
                          onChange={(e) => handleChange('require_approval_for_purchases', e.target.checked)}
                        />
                      }
                      label="Require Approval for Purchases"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.require_approval_for_sales}
                          onChange={(e) => handleChange('require_approval_for_sales', e.target.checked)}
                        />
                      }
                      label="Require Approval for Sales"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* POS Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Point of Sale (POS) Settings
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.enable_barcode_scanning}
                          onChange={(e) => handleChange('enable_barcode_scanning', e.target.checked)}
                        />
                      }
                      label="Enable Barcode Scanning"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Default Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Default Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Default Currency"
                        value={formData.default_currency}
                        onChange={(e) => handleChange('default_currency', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Backup Frequency"
                        value={formData.backup_frequency}
                        onChange={(e) => handleChange('backup_frequency', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        {backupFrequencies.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Warning Alert */}
            <Grid item xs={12}>
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="subtitle2" gutterBottom>
                  Important Notice
                </Typography>
                <Typography variant="body2">
                  Changes to system settings may affect the behavior of existing transactions and reports. 
                  Please review all changes carefully before saving.
                </Typography>
              </Alert>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    component={InertiaLink}
                    href="/settings"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
};

export default SystemSettings;
