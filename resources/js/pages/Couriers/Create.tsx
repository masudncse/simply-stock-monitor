import React, { useState } from 'react';
import { router } from '@inertiajs/react';
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
import { index as indexRoute } from '@/routes/couriers';

export default function CouriersCreate() {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    code: '',
    contact_person: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    base_rate: 0,
    per_kg_rate: 0,
    coverage_areas: '',
    notes: '',
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

    router.post('/couriers', formData, {
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  return (
    <Layout title="Create Courier - Add a new courier service">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Courier</h1>
            <p className="text-muted-foreground">
              Add a new courier service to your system
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit(indexRoute.url())}
          >
            <BackIcon className="mr-2 h-4 w-4" />
            Back to Couriers
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
                  <Label htmlFor="name">Courier Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    placeholder="e.g., FedEx, DHL, SA Poribahan"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch Name</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className={errors.branch ? 'border-destructive' : ''}
                    placeholder="e.g., Dhaka Main Branch, Chittagong"
                  />
                  {errors.branch && <p className="text-sm text-destructive">{errors.branch}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Courier Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className={errors.code ? 'border-destructive' : ''}
                  placeholder="e.g., FDX, DHL, SAP"
                />
                {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleChange('contact_person', e.target.value)}
                  className={errors.contact_person ? 'border-destructive' : ''}
                  placeholder="Primary contact name"
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
                    className={errors.phone ? 'border-destructive' : ''}
                    placeholder="+880-1234-567890"
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
                    className={errors.email ? 'border-destructive' : ''}
                    placeholder="contact@courier.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  type="url"
                  className={errors.website ? 'border-destructive' : ''}
                  placeholder="https://www.courier.com"
                />
                {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={errors.address ? 'border-destructive' : ''}
                  placeholder="Office address"
                  rows={3}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="base_rate">Base Rate (৳)</Label>
                  <Input
                    id="base_rate"
                    value={formData.base_rate}
                    onChange={(e) => handleChange('base_rate', parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                    min="0"
                    className={errors.base_rate ? 'border-destructive' : ''}
                    placeholder="50.00"
                  />
                  {errors.base_rate && <p className="text-sm text-destructive">{errors.base_rate}</p>}
                  <p className="text-xs text-muted-foreground">Minimum charge per shipment</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="per_kg_rate">Per Kg Rate (৳)</Label>
                  <Input
                    id="per_kg_rate"
                    value={formData.per_kg_rate}
                    onChange={(e) => handleChange('per_kg_rate', parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                    min="0"
                    className={errors.per_kg_rate ? 'border-destructive' : ''}
                    placeholder="15.00"
                  />
                  {errors.per_kg_rate && <p className="text-sm text-destructive">{errors.per_kg_rate}</p>}
                  <p className="text-xs text-muted-foreground">Additional charge per kilogram</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverage_areas">Coverage Areas</Label>
                <Textarea
                  id="coverage_areas"
                  value={formData.coverage_areas}
                  onChange={(e) => handleChange('coverage_areas', e.target.value)}
                  className={errors.coverage_areas ? 'border-destructive' : ''}
                  placeholder="e.g., Bangladesh - All major cities, Dhaka, Chittagong, Sylhet"
                  rows={3}
                />
                {errors.coverage_areas && <p className="text-sm text-destructive">{errors.coverage_areas}</p>}
                <p className="text-xs text-muted-foreground">Areas where this courier delivers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className={errors.notes ? 'border-destructive' : ''}
                  placeholder="Additional notes or special instructions"
                  rows={4}
                />
                {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(indexRoute.url())}
            >
              Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" />
              Create Courier
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

