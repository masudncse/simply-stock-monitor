import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save as SaveIcon, ArrowLeft as BackIcon } from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { store as storeRoute, index as indexRoute } from '@/routes/suppliers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: '/suppliers',
    },
    {
        title: 'Create Supplier',
        href: '#',
    },
];

export default function SuppliersCreate() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    tax_number: '',
    credit_limit: 0,
    outstanding_amount: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.post(storeRoute.url(), formData, {
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  return (
    <Layout title="Create Supplier" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Supplier</h1>
            <p className="text-muted-foreground">
              Add a new supplier to your system
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Supplier Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Supplier Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className={errors.code ? 'border-destructive' : ''}
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleChange('contact_person', e.target.value)}
                    className={errors.contact_person ? 'border-destructive' : ''}
                  />
                  {errors.contact_person && (
                    <p className="text-sm text-destructive">{errors.contact_person}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active" className="text-sm font-normal">
                      Active
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={errors.address ? 'border-destructive' : ''}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_number">Tax Number</Label>
                  <Input
                    id="tax_number"
                    value={formData.tax_number}
                    onChange={(e) => handleChange('tax_number', e.target.value)}
                    className={errors.tax_number ? 'border-destructive' : ''}
                  />
                  {errors.tax_number && (
                    <p className="text-sm text-destructive">{errors.tax_number}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="credit_limit">Credit Limit</Label>
                  <Input
                    id="credit_limit"
                    type="number"
                    value={formData.credit_limit}
                    onChange={(e) => handleChange('credit_limit', parseFloat(e.target.value) || 0)}
                    className={errors.credit_limit ? 'border-destructive' : ''}
                  />
                  {errors.credit_limit && (
                    <p className="text-sm text-destructive">{errors.credit_limit}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstanding_amount">Outstanding Amount</Label>
                  <Input
                    id="outstanding_amount"
                    type="number"
                    value={formData.outstanding_amount}
                    onChange={(e) => handleChange('outstanding_amount', parseFloat(e.target.value) || 0)}
                    className={errors.outstanding_amount ? 'border-destructive' : ''}
                  />
                  {errors.outstanding_amount && (
                    <p className="text-sm text-destructive">{errors.outstanding_amount}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" />
              Create Supplier
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}