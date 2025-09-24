import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface AppearanceSettings {
  theme: string;
  sidebar_collapsed: boolean;
  language: string;
  date_format: string;
  time_format: string;
  currency: string;
  timezone: string;
}

export default function Appearance() {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'system',
    sidebar_collapsed: false,
    language: 'en',
    date_format: 'Y-m-d',
    time_format: 'H:i:s',
    currency: 'USD',
    timezone: 'UTC',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving appearance settings:', settings);
    // router.post('/settings/appearance', settings);
  };

  const handleBack = () => {
    router.visit('/settings');
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Appearance Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back to Settings
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Theme Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Theme & Display
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={settings.theme}
                        onChange={handleSelectChange('theme')}
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System Default</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.sidebar_collapsed}
                          onChange={handleChange('sidebar_collapsed')}
                        />
                      }
                      label="Collapse Sidebar by Default"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Language & Localization */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Language & Localization
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={settings.language}
                        onChange={handleSelectChange('language')}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="it">Italian</MenuItem>
                        <MenuItem value="pt">Portuguese</MenuItem>
                        <MenuItem value="ru">Russian</MenuItem>
                        <MenuItem value="zh">Chinese</MenuItem>
                        <MenuItem value="ja">Japanese</MenuItem>
                        <MenuItem value="ko">Korean</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.timezone}
                        onChange={handleSelectChange('timezone')}
                        label="Timezone"
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        <MenuItem value="Europe/London">London</MenuItem>
                        <MenuItem value="Europe/Paris">Paris</MenuItem>
                        <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                        <MenuItem value="Asia/Shanghai">Shanghai</MenuItem>
                        <MenuItem value="Australia/Sydney">Sydney</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Date & Time Format */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Date & Time Format
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Date Format</InputLabel>
                      <Select
                        value={settings.date_format}
                        onChange={handleSelectChange('date_format')}
                        label="Date Format"
                      >
                        <MenuItem value="Y-m-d">YYYY-MM-DD</MenuItem>
                        <MenuItem value="m/d/Y">MM/DD/YYYY</MenuItem>
                        <MenuItem value="d/m/Y">DD/MM/YYYY</MenuItem>
                        <MenuItem value="Y-m-d">YYYY-MM-DD</MenuItem>
                        <MenuItem value="d-m-Y">DD-MM-YYYY</MenuItem>
                        <MenuItem value="M d, Y">MMM DD, YYYY</MenuItem>
                        <MenuItem value="d M Y">DD MMM YYYY</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Time Format</InputLabel>
                      <Select
                        value={settings.time_format}
                        onChange={handleSelectChange('time_format')}
                        label="Time Format"
                      >
                        <MenuItem value="H:i:s">24 Hour (HH:MM:SS)</MenuItem>
                        <MenuItem value="h:i:s A">12 Hour (HH:MM:SS AM/PM)</MenuItem>
                        <MenuItem value="H:i">24 Hour (HH:MM)</MenuItem>
                        <MenuItem value="h:i A">12 Hour (HH:MM AM/PM)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Currency Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Currency Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={settings.currency}
                        onChange={handleSelectChange('currency')}
                        label="Currency"
                      >
                        <MenuItem value="USD">US Dollar ($)</MenuItem>
                        <MenuItem value="EUR">Euro (€)</MenuItem>
                        <MenuItem value="GBP">British Pound (£)</MenuItem>
                        <MenuItem value="JPY">Japanese Yen (¥)</MenuItem>
                        <MenuItem value="CAD">Canadian Dollar (C$)</MenuItem>
                        <MenuItem value="AUD">Australian Dollar (A$)</MenuItem>
                        <MenuItem value="CHF">Swiss Franc (CHF)</MenuItem>
                        <MenuItem value="CNY">Chinese Yuan (¥)</MenuItem>
                        <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                        <MenuItem value="BRL">Brazilian Real (R$)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Preview Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Current settings preview:
            </Typography>
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Theme:</strong> {settings.theme}<br />
                <strong>Language:</strong> {settings.language}<br />
                <strong>Date Format:</strong> {settings.date_format}<br />
                <strong>Time Format:</strong> {settings.time_format}<br />
                <strong>Currency:</strong> {settings.currency}<br />
                <strong>Timezone:</strong> {settings.timezone}<br />
                <strong>Sidebar Collapsed:</strong> {settings.sidebar_collapsed ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}