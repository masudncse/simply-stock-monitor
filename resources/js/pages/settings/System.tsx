import React, { useState } from 'react';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings',
  },
  {
    title: 'System Settings',
    href: '/settings/system',
  },
];

const SystemSettings: React.FC<SystemSettingsProps> = ({ settings }) => {
  const { errors } = usePage<SharedData>().props;
  const [formData, setFormData] = useState({
    low_stock_threshold: settings.low_stock_threshold || 10,
    auto_generate_invoice: settings.auto_generate_invoice || true,
    require_approval_for_purchases: settings.require_approval_for_purchases || false,
    require_approval_for_sales: settings.require_approval_for_sales || false,
    enable_barcode_scanning: settings.enable_barcode_scanning || true,
    enable_inventory_tracking: settings.enable_inventory_tracking || true,
    enable_multi_warehouse: settings.enable_multi_warehouse || true,
    default_tax_rate: settings.default_tax_rate || 0,
    default_currency: settings.default_currency || 'USD',
    backup_frequency: settings.backup_frequency || 'daily',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | boolean | number) => {
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
    { code: 'BDT', name: 'Bangladeshi Taka' },
  ];

  const backupFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Layout title="System Settings - Configure system behavior and operational settings" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure system behavior and operational settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please fix the following errors:
                <ul className="mt-2 list-disc list-inside">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <select
                    id="default_currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.default_currency}
                    onChange={(e) => handleChange('default_currency', e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  {errors.default_currency && (
                    <p className="text-sm text-destructive">{errors.default_currency}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                  <Input
                    id="default_tax_rate"
                    type="number"
                    value={formData.default_tax_rate}
                    onChange={(e) => handleChange('default_tax_rate', parseFloat(e.target.value) || 0)}
                  />
                  {errors.default_tax_rate && (
                    <p className="text-sm text-destructive">{errors.default_tax_rate}</p>
                  )}
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => handleChange('low_stock_threshold', parseInt(e.target.value) || 1)}
                  />
                  {errors.low_stock_threshold && (
                    <p className="text-sm text-destructive">{errors.low_stock_threshold}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Minimum quantity before low stock alert</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_inventory_tracking"
                    checked={formData.enable_inventory_tracking}
                    onCheckedChange={(checked) => handleChange('enable_inventory_tracking', checked)}
                  />
                  <Label htmlFor="enable_inventory_tracking">Enable Inventory Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_multi_warehouse"
                    checked={formData.enable_multi_warehouse}
                    onCheckedChange={(checked) => handleChange('enable_multi_warehouse', checked)}
                  />
                  <Label htmlFor="enable_multi_warehouse">Enable Multi-Warehouse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_barcode_scanning"
                    checked={formData.enable_barcode_scanning}
                    onCheckedChange={(checked) => handleChange('enable_barcode_scanning', checked)}
                  />
                  <Label htmlFor="enable_barcode_scanning">Enable Barcode Scanning</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto_generate_invoice"
                    checked={formData.auto_generate_invoice}
                    onCheckedChange={(checked) => handleChange('auto_generate_invoice', checked)}
                  />
                  <Label htmlFor="auto_generate_invoice">Auto Generate Invoice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_approval_for_purchases"
                    checked={formData.require_approval_for_purchases}
                    onCheckedChange={(checked) => handleChange('require_approval_for_purchases', checked)}
                  />
                  <Label htmlFor="require_approval_for_purchases">Require Approval for Purchases</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_approval_for_sales"
                    checked={formData.require_approval_for_sales}
                    onCheckedChange={(checked) => handleChange('require_approval_for_sales', checked)}
                  />
                  <Label htmlFor="require_approval_for_sales">Require Approval for Sales</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {errors.backup_frequency && (
                    <p className="text-sm text-destructive">{errors.backup_frequency}</p>
                  )}
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
