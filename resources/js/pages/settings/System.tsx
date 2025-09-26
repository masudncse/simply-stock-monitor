import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import Layout from '../../layouts/Layout';

interface SystemSettingsProps {
  settings: {
    currency: string;
    timezone: string;
    date_format: string;
    time_format: string;
    low_stock_threshold: string;
    auto_backup: string;
    backup_frequency: string;
  };
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    currency: settings.currency || 'USD',
    timezone: settings.timezone || 'UTC',
    date_format: settings.date_format || 'Y-m-d',
    time_format: settings.time_format || 'H:i',
    low_stock_threshold: settings.low_stock_threshold || '10',
    auto_backup: settings.auto_backup || 'false',
    backup_frequency: settings.backup_frequency || 'daily',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.put('/settings/system', formData, {
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
    { code: 'BDT', name: 'Bangladeshi Taka' },
  ];

  const backupFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="mr-2 h-8 w-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Configure system behavior and operational settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Chicago">America/Chicago</option>
                    <option value="America/Denver">America/Denver</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="Asia/Shanghai">Asia/Shanghai</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="Australia/Sydney">Australia/Sydney</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <select
                    id="date_format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.date_format}
                    onChange={(e) => handleChange('date_format', e.target.value)}
                  >
                    <option value="Y-m-d">YYYY-MM-DD (2024-01-15)</option>
                    <option value="m/d/Y">MM/DD/YYYY (01/15/2024)</option>
                    <option value="d/m/Y">DD/MM/YYYY (15/01/2024)</option>
                    <option value="M d, Y">Jan 15, 2024</option>
                    <option value="d M Y">15 Jan 2024</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_format">Time Format</Label>
                  <select
                    id="time_format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.time_format}
                    onChange={(e) => handleChange('time_format', e.target.value)}
                  >
                    <option value="H:i:s">24-hour (14:30:45)</option>
                    <option value="h:i:s A">12-hour (2:30:45 PM)</option>
                    <option value="H:i">24-hour short (14:30)</option>
                    <option value="h:i A">12-hour short (2:30 PM)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  min="0"
                  value={formData.low_stock_threshold}
                  onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Minimum quantity before low stock alert</p>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto_backup"
                    checked={formData.auto_backup === 'true'}
                    onCheckedChange={(checked) => handleChange('auto_backup', checked.toString())}
                  />
                  <Label htmlFor="auto_backup">Enable Automatic Backups</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup_frequency">Backup Frequency</Label>
                  <select
                    id="backup_frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.backup_frequency}
                    onChange={(e) => handleChange('backup_frequency', e.target.value)}
                  >
                    {backupFrequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <div>
              <h4 className="font-medium">Important Notice</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Changes to system settings may affect the behavior of existing transactions and reports. 
                Please review all changes carefully before saving.
              </p>
            </div>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button asChild variant="outline">
              <InertiaLink href="/settings">
                Cancel
              </InertiaLink>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SystemSettings;
