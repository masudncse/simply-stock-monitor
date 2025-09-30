import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Save as SaveIcon,
  ArrowLeft as BackIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

export default function CustomersCreate() {
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

    router.post('/customers', formData, {
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  return (
    <Layout title="Create Customer">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Customer</h1>
            <p className="text-muted-foreground">
              Add a new customer to your system
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/customers')}
          >
            <BackIcon className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Customer Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className={errors.code ? 'border-destructive' : ''}
                  />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleChange('contact_person', e.target.value)}
                  isInvalid={!!errors.contact_person}
                />
                {errors.contact_person && <p className="text-sm text-destructive">{errors.contact_person}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
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
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    type="tel"
                    isInvalid={!!errors.phone}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    type="email"
                    isInvalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  isInvalid={!!errors.address}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_number">Tax Number</Label>
                <Input
                  id="tax_number"
                  value={formData.tax_number}
                  onChange={(e) => handleChange('tax_number', e.target.value)}
                  isInvalid={!!errors.tax_number}
                />
                {errors.tax_number && <p className="text-sm text-destructive">{errors.tax_number}</p>}
              </div>
            </CardContent>
          </Card>

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
                    value={formData.credit_limit}
                    onChange={(e) => handleChange('credit_limit', parseFloat(e.target.value) || 0)}
                    type="number"
                    className={errors.credit_limit ? 'border-destructive' : ''}
                  />
                  {errors.credit_limit && <p className="text-sm text-destructive">{errors.credit_limit}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstanding_amount">Outstanding Amount</Label>
                  <Input
                    id="outstanding_amount"
                    value={formData.outstanding_amount}
                    onChange={(e) => handleChange('outstanding_amount', parseFloat(e.target.value) || 0)}
                    type="number"
                    className={errors.outstanding_amount ? 'border-destructive' : ''}
                  />
                  {errors.outstanding_amount && <p className="text-sm text-destructive">{errors.outstanding_amount}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <InertiaLink href="/customers">
                Cancel
              </InertiaLink>
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" />
              Create Customer
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
