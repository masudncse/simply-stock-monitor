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
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

interface CompanySettingsProps {
  settings: {
    company_name: string;
    company_address: string;
    company_phone: string;
    company_email: string;
    company_website: string;
    tax_number: string;
    currency: string;
    timezone: string;
    date_format: string;
    time_format: string;
  };
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ settings }) => {
  const [formData, setFormData] = useState(settings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/settings/company', formData, {
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

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  const dateFormats = [
    { value: 'Y-m-d', label: 'YYYY-MM-DD (2024-01-15)' },
    { value: 'm/d/Y', label: 'MM/DD/YYYY (01/15/2024)' },
    { value: 'd/m/Y', label: 'DD/MM/YYYY (15/01/2024)' },
    { value: 'M d, Y', label: 'Jan 15, 2024' },
    { value: 'd M Y', label: '15 Jan 2024' },
  ];

  const timeFormats = [
    { value: 'H:i:s', label: '24-hour (14:30:45)' },
    { value: 'h:i:s A', label: '12-hour (2:30:45 PM)' },
    { value: 'H:i', label: '24-hour short (14:30)' },
    { value: 'h:i A', label: '12-hour short (2:30 PM)' },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Company Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your company information and preferences
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Company Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        value={formData.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tax Number"
                        value={formData.tax_number}
                        onChange={(e) => handleChange('tax_number', e.target.value)}
                        placeholder="VAT, GST, or Tax ID"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Address"
                        value={formData.company_address}
                        onChange={(e) => handleChange('company_address', e.target.value)}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.company_phone}
                        onChange={(e) => handleChange('company_phone', e.target.value)}
                        type="tel"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={formData.company_email}
                        onChange={(e) => handleChange('company_email', e.target.value)}
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={formData.company_website}
                        onChange={(e) => handleChange('company_website', e.target.value)}
                        type="url"
                        placeholder="https://www.example.com"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Regional Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Regional Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Currency"
                        value={formData.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
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
                        label="Timezone"
                        value={formData.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Date Format"
                        value={formData.date_format}
                        onChange={(e) => handleChange('date_format', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        {dateFormats.map((format) => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Time Format"
                        value={formData.time_format}
                        onChange={(e) => handleChange('time_format', e.target.value)}
                        SelectProps={{ native: true }}
                      >
                        {timeFormats.map((format) => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
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

export default CompanySettings;
