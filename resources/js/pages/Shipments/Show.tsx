import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft as BackIcon,
  Edit as EditIcon,
  Printer as PrintIcon,
  Trash2 as DeleteIcon,
  Truck as ShipmentIcon,
  Package as PackageIcon,
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  DollarSign,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute, destroy as destroyRoute, print as printRoute, updateStatus as updateStatusRoute } from '@/routes/shipments';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Customer {
  id: number;
  name: string;
  code: string;
  phone: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  items: SaleItem[];
}

interface User {
  id: number;
  name: string;
}

interface Shipment {
  id: number;
  shipment_number: string;
  sale: Sale;
  customer: Customer;
  courier_service: string;
  tracking_number: string | null;
  shipping_date: string;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  status: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: string | null;
  recipient_district: string | null;
  recipient_postal_code: string | null;
  number_of_packages: number;
  total_weight: number | null;
  package_dimensions: string | null;
  shipping_cost: number;
  is_paid: boolean;
  notes: string | null;
  special_instructions: string | null;
  created_by: User;
  created_at: string;
}

interface ShipmentsShowProps {
  shipment: Shipment;
}

export default function ShipmentsShow({ shipment }: ShipmentsShowProps) {
  const [selectedStatus, setSelectedStatus] = useState(shipment.status);

  const handleStatusUpdate = () => {
    if (selectedStatus !== shipment.status) {
      router.post(updateStatusRoute.url({ shipment: shipment.id }), {
        status: selectedStatus,
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      router.delete(destroyRoute.url({ shipment: shipment.id }), {
        onSuccess: () => router.visit(indexRoute.url()),
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-gray-500',
      'picked_up': 'bg-blue-500',
      'in_transit': 'bg-yellow-500',
      'out_for_delivery': 'bg-orange-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'returned': 'bg-purple-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Layout title={`Shipment ${shipment.shipment_number}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipment Details</h1>
            <p className="text-muted-foreground">
              {shipment.shipment_number} • {shipment.courier_service}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={() => router.visit(printRoute.url({ shipment: shipment.id }))}>
              <PrintIcon className="mr-2 h-4 w-4" />
              Print Label
            </Button>
            {shipment.status !== 'delivered' && (
              <Button variant="destructive" onClick={handleDelete}>
                <DeleteIcon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Status Update Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShipmentIcon className="h-5 w-5" />
              Shipment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={selectedStatus === shipment.status}
                className="bg-green-600 hover:bg-green-700"
              >
                Update Status
              </Button>
              <Badge className={getStatusColor(shipment.status)}>
                {getStatusLabel(shipment.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Courier Information */}
          <Card>
            <CardHeader>
              <CardTitle>Courier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Courier Service</p>
                <p className="text-lg font-semibold">{shipment.courier_service}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="text-lg font-mono">{shipment.tracking_number || 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Shipping Cost</p>
                <p className="text-lg font-semibold">
                  ${shipment.shipping_cost.toFixed(2)}
                  <Badge variant="outline" className="ml-2">
                    {shipment.is_paid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Shipping Date</p>
                <p className="text-lg font-semibold">
                  {new Date(shipment.shipping_date).toLocaleDateString()}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Expected Delivery</p>
                <p className="text-lg font-semibold">
                  {shipment.expected_delivery_date 
                    ? new Date(shipment.expected_delivery_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Actual Delivery</p>
                <p className="text-lg font-semibold">
                  {shipment.actual_delivery_date 
                    ? new Date(shipment.actual_delivery_date).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LocationIcon className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{shipment.recipient_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{shipment.recipient_phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{shipment.recipient_address}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {shipment.recipient_city && (
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="text-sm">{shipment.recipient_city}</p>
                  </div>
                )}
                {shipment.recipient_district && (
                  <div>
                    <p className="text-xs text-muted-foreground">District</p>
                    <p className="text-sm">{shipment.recipient_district}</p>
                  </div>
                )}
                {shipment.recipient_postal_code && (
                  <div>
                    <p className="text-xs text-muted-foreground">Postal Code</p>
                    <p className="text-sm">{shipment.recipient_postal_code}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Number of Packages</p>
                <p className="text-lg font-semibold">{shipment.number_of_packages}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="font-semibold">
                  {shipment.total_weight ? `${shipment.total_weight} kg` : 'N/A'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-semibold">{shipment.package_dimensions || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sale Items */}
        <Card>
          <CardHeader>
            <CardTitle>Sale Items (Invoice: {shipment.sale.invoice_number})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipment.sale.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.product.sku}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Notes & Instructions */}
        {(shipment.notes || shipment.special_instructions) && (
          <div className="grid gap-6 md:grid-cols-2">
            {shipment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{shipment.notes}</p>
                </CardContent>
              </Card>
            )}
            {shipment.special_instructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{shipment.special_instructions}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-semibold">{shipment.created_by.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-semibold">
                  {new Date(shipment.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold">
                  {shipment.customer.name} ({shipment.customer.code})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

