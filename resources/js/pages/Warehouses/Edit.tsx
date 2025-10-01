import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft as BackIcon,
  Save as SaveIcon,
  Building2 as WarehouseIcon,
  AlertCircle as AlertIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { type SharedData } from '@/types';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

interface EditWarehouseProps {
  warehouse: Warehouse;
}


export default function EditWarehouse({ warehouse }: EditWarehouseProps) {
  const { errors } = usePage<SharedData>().props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: warehouse.name,
    code: warehouse.code,
    address: warehouse.address || '',
    contact_person: warehouse.contact_person || '',
    phone: warehouse.phone || '',
    email: warehouse.email || '',
    is_active: warehouse.is_active,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.put(`/warehouses/${warehouse.id}`, formData, {
      onFinish: () => setIsSubmitting(false),
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    });
  };

  return (
    <Layout title="Edit Warehouse">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WarehouseIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Edit Warehouse</h1>
              <p className="text-muted-foreground">
                Update warehouse information
              </p>
            </div>
          </div>
          <Link href="/warehouses">
            <Button variant="outline">
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Warehouses
            </Button>
          </Link>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Warehouse Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter warehouse name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <Alert variant="destructive">
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Warehouse Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    placeholder="Enter warehouse code"
                    className={errors.code ? 'border-destructive' : ''}
                  />
                  {errors.code && (
                    <Alert variant="destructive">
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription>{errors.code}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter warehouse address"
                  rows={3}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <Alert variant="destructive">
                    <AlertIcon className="h-4 w-4" />
                    <AlertDescription>{errors.address}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleChange('contact_person', e.target.value)}
                    placeholder="Enter contact person name"
                    className={errors.contact_person ? 'border-destructive' : ''}
                  />
                  {errors.contact_person && (
                    <Alert variant="destructive">
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription>{errors.contact_person}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <Alert variant="destructive">
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription>{errors.phone}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <Alert variant="destructive">
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
                <span className="text-sm text-muted-foreground">
                  (Inactive warehouses won't be available for selection in transactions)
                </span>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link href="/warehouses">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Update Warehouse
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
