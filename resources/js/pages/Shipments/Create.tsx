import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft as BackIcon,
  Save as SaveIcon,
  AlertTriangle,
} from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { CourierCombobox } from '@/components/CourierCombobox';
import { index as indexRoute, store as storeRoute } from '@/routes/shipments';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  customer: Customer;
  items: SaleItem[];
}

interface ShipmentsCreateProps {
  sale?: Sale;
}

export default function ShipmentsCreate({ sale }: ShipmentsCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    sale_id: sale?.id || '',
    courier_id: '',
    courier_service: '', // Keep for backward compatibility
    tracking_number: '',
    shipping_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    recipient_name: sale?.customer.name || '',
    recipient_phone: sale?.customer.phone || '',
    recipient_address: sale?.customer.address || '',
    recipient_city: '',
    recipient_district: '',
    recipient_postal_code: '',
    number_of_packages: 1,
    total_weight: '',
    package_dimensions: '',
    shipping_cost: 0,
    notes: '',
    special_instructions: '',
  });

  const [selectedCourierData, setSelectedCourierData] = useState<{ base_rate: number; per_kg_rate: number } | null>(null);

  // Fetch courier data when courier_id changes
  useEffect(() => {
    if (data.courier_id) {
      fetch(`/couriers-api/active`)
        .then(res => res.json())
        .then(couriers => {
          const courier = couriers.find((c: any) => c.id.toString() === data.courier_id);
          if (courier) {
            setSelectedCourierData({ base_rate: courier.base_rate, per_kg_rate: courier.per_kg_rate });
          }
        })
        .catch(err => console.error('Error fetching courier data:', err));
    } else {
      setSelectedCourierData(null);
    }
  }, [data.courier_id]);

  // Auto-calculate shipping cost when courier or weight changes
  useEffect(() => {
    if (selectedCourierData && data.total_weight) {
      const weight = parseFloat(data.total_weight) || 0;
      const calculatedCost = selectedCourierData.base_rate + (weight * selectedCourierData.per_kg_rate);
      setData('shipping_cost', parseFloat(calculatedCost.toFixed(2)));
    }
  }, [selectedCourierData, data.total_weight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(storeRoute.url());
  };

  return (
    <Layout title="Create Shipment - Track delivery via courier">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Shipment</h1>
            <p className="text-muted-foreground">
              Create a new shipment for delivery tracking
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
            <BackIcon className="mr-2 h-4 w-4" />
            Back to Shipments
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors below before submitting.
              </AlertDescription>
            </Alert>
          )}

          {/* Sale Information */}
          {sale && (
            <Card>
              <CardHeader>
                <CardTitle>Sale Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="text-lg font-semibold">{sale.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="text-lg font-semibold">{sale.customer.name} ({sale.customer.code})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Courier Information */}
          <Card>
            <CardHeader>
              <CardTitle>Courier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courier_id">Courier Service *</Label>
                  <CourierCombobox
                    value={data.courier_id}
                    onValueChange={(value) => setData('courier_id', value)}
                    placeholder="Select courier..."
                    showRates={true}
                    error={!!(errors.courier_id || errors.courier_service)}
                  />
                  {(errors.courier_id || errors.courier_service) && (
                    <p className="text-sm text-destructive">{errors.courier_id || errors.courier_service}</p>
                  )}
                  {selectedCourierData && (
                    <p className="text-xs text-muted-foreground">
                      Base: ৳{selectedCourierData.base_rate.toFixed(2)} + ৳{selectedCourierData.per_kg_rate.toFixed(2)}/kg
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    id="tracking_number"
                    value={data.tracking_number}
                    onChange={(e) => setData('tracking_number', e.target.value)}
                    placeholder="e.g., TRK123456789"
                    className={errors.tracking_number ? 'border-destructive' : ''}
                  />
                  {errors.tracking_number && (
                    <p className="text-sm text-destructive">{errors.tracking_number}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping_date">Shipping Date *</Label>
                  <Input
                    id="shipping_date"
                    type="date"
                    value={data.shipping_date}
                    onChange={(e) => setData('shipping_date', e.target.value)}
                    className={errors.shipping_date ? 'border-destructive' : ''}
                  />
                  {errors.shipping_date && (
                    <p className="text-sm text-destructive">{errors.shipping_date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
                  <Input
                    id="expected_delivery_date"
                    type="date"
                    value={data.expected_delivery_date}
                    onChange={(e) => setData('expected_delivery_date', e.target.value)}
                    className={errors.expected_delivery_date ? 'border-destructive' : ''}
                  />
                  {errors.expected_delivery_date && (
                    <p className="text-sm text-destructive">{errors.expected_delivery_date}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_cost">Shipping Cost (৳) *</Label>
                <Input
                  id="shipping_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.shipping_cost}
                  onChange={(e) => setData('shipping_cost', parseFloat(e.target.value) || 0)}
                  className={errors.shipping_cost ? 'border-destructive' : ''}
                />
                {errors.shipping_cost && (
                  <p className="text-sm text-destructive">{errors.shipping_cost}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Auto-calculated based on courier rates and weight (you can modify)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Recipient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient_name">Recipient Name *</Label>
                  <Input
                    id="recipient_name"
                    value={data.recipient_name}
                    onChange={(e) => setData('recipient_name', e.target.value)}
                    className={errors.recipient_name ? 'border-destructive' : ''}
                  />
                  {errors.recipient_name && (
                    <p className="text-sm text-destructive">{errors.recipient_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_phone">Recipient Phone *</Label>
                  <Input
                    id="recipient_phone"
                    value={data.recipient_phone}
                    onChange={(e) => setData('recipient_phone', e.target.value)}
                    placeholder="+880-1XXXXXXXXX"
                    className={errors.recipient_phone ? 'border-destructive' : ''}
                  />
                  {errors.recipient_phone && (
                    <p className="text-sm text-destructive">{errors.recipient_phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient_address">Recipient Address *</Label>
                <Textarea
                  id="recipient_address"
                  value={data.recipient_address}
                  onChange={(e) => setData('recipient_address', e.target.value)}
                  rows={3}
                  className={errors.recipient_address ? 'border-destructive' : ''}
                />
                {errors.recipient_address && (
                  <p className="text-sm text-destructive">{errors.recipient_address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient_city">City</Label>
                  <Input
                    id="recipient_city"
                    value={data.recipient_city}
                    onChange={(e) => setData('recipient_city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_district">District</Label>
                  <Input
                    id="recipient_district"
                    value={data.recipient_district}
                    onChange={(e) => setData('recipient_district', e.target.value)}
                    placeholder="e.g., Dhaka, Chittagong"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_postal_code">Postal Code</Label>
                  <Input
                    id="recipient_postal_code"
                    value={data.recipient_postal_code}
                    onChange={(e) => setData('recipient_postal_code', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_packages">Number of Packages *</Label>
                  <Input
                    id="number_of_packages"
                    type="number"
                    min="1"
                    value={data.number_of_packages}
                    onChange={(e) => setData('number_of_packages', parseInt(e.target.value) || 1)}
                    className={errors.number_of_packages ? 'border-destructive' : ''}
                  />
                  {errors.number_of_packages && (
                    <p className="text-sm text-destructive">{errors.number_of_packages}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_weight">Total Weight (kg)</Label>
                  <Input
                    id="total_weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.total_weight}
                    onChange={(e) => setData('total_weight', e.target.value)}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package_dimensions">Dimensions (L×W×H)</Label>
                  <Input
                    id="package_dimensions"
                    value={data.package_dimensions}
                    onChange={(e) => setData('package_dimensions', e.target.value)}
                    placeholder="e.g., 30x20x10 cm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="special_instructions">Special Instructions</Label>
                <Textarea
                  id="special_instructions"
                  value={data.special_instructions}
                  onChange={(e) => setData('special_instructions', e.target.value)}
                  rows={2}
                  placeholder="Handle with care, fragile items, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(indexRoute.url())}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {processing ? 'Creating...' : 'Create Shipment'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

