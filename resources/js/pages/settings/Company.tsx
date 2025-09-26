import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2 as BusinessIcon,
  Save as SaveIcon,
} from 'lucide-react';
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
    { code: 'BDT', name: 'Bangladeshi Taka' },
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
    <Layout title="Company Settings">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BusinessIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your company information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_number">Tax Number</Label>
                  <Input
                    id="tax_number"
                    value={formData.tax_number}
                    onChange={(e) => handleChange('tax_number', e.target.value)}
                    placeholder="VAT, GST, or Tax ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_address">Company Address</Label>
                <Textarea
                  id="company_address"
                  value={formData.company_address}
                  onChange={(e) => handleChange('company_address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_phone">Phone Number</Label>
                  <Input
                    id="company_phone"
                    type="tel"
                    value={formData.company_phone}
                    onChange={(e) => handleChange('company_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_email">Email Address</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => handleChange('company_email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_website">Website</Label>
                <Input
                  id="company_website"
                  type="url"
                  value={formData.company_website}
                  onChange={(e) => handleChange('company_website', e.target.value)}
                  placeholder="https://www.example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select value={formData.date_format} onValueChange={(value) => handleChange('date_format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_format">Time Format</Label>
                  <Select value={formData.time_format} onValueChange={(value) => handleChange('time_format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" asChild>
                  <InertiaLink href="/settings">
                    Cancel
                  </InertiaLink>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default CompanySettings;