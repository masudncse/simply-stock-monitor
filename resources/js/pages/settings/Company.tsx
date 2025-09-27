import React, { useState, useEffect } from 'react';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2 as BusinessIcon,
  Save as SaveIcon,
  AlertTriangle,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

interface CompanySettingsProps {
  settings: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    tax_id?: string;
    website?: string;
    logo?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings',
  },
  {
    title: 'Company Settings',
    href: '/settings/company',
  },
];

const CompanySettings: React.FC<CompanySettingsProps> = ({ settings }) => {
  const { errors } = usePage<SharedData>().props;
  
  // Debug: Log the settings to see what we're getting
  console.log('Company Settings:', settings);
  
  const [formData, setFormData] = useState({
    name: settings.name || '',
    email: settings.email || '',
    phone: settings.phone || '',
    address: settings.address || '',
    city: settings.city || '',
    state: settings.state || '',
    postal_code: settings.postal_code || '',
    country: settings.country || '',
    tax_id: settings.tax_id || '',
    website: settings.website || '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    settings.logo ? `/storage/${settings.logo}` : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    
    // Add form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    // Add logo file if selected
    if (logoFile) {
      data.append('logo', logoFile);
    }

    router.post('/settings/company', data, {
      onFinish: () => setIsSubmitting(false),
      forceFormData: true,
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
    <Layout title="Company Settings" breadcrumbs={breadcrumbs}>
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

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) => handleChange('tax_id', e.target.value)}
                    placeholder="VAT, GST, or Tax ID"
                  />
                  {errors.tax_id && (
                    <p className="text-sm text-destructive">{errors.tax_id}</p>
                  )}
                </div>
              </div>
              
              {/* Company Logo */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  {(logoPreview || settings.logo) && (
                    <div className="relative">
                      <img
                        src={logoPreview || `/storage/${settings.logo}`}
                        alt="Company Logo Preview"
                        className="w-20 h-20 object-contain border rounded-lg bg-background"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeLogo}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a logo image (JPG, PNG, GIF, SVG). Max size: 2MB.
                    </p>
                    {errors.logo && (
                      <p className="text-sm text-destructive">{errors.logo}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Company Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleChange('postal_code', e.target.value)}
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-destructive">{errors.postal_code}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
                )}
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