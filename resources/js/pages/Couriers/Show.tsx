import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft as BackIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  Truck,
  Phone,
  Mail,
  Globe,
  MapPin,
  DollarSign,
  Package,
  FileText,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/couriers';

interface Courier {
  id: number;
  name: string;
  branch?: string;
  code?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  base_rate: number;
  per_kg_rate: number;
  coverage_areas?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CouriersShowProps {
  courier: Courier;
  shipmentsCount: number;
}

export default function CouriersShow({ courier, shipmentsCount }: CouriersShowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    router.delete(destroyRoute.url({ courier: courier.id }), {
      onSuccess: () => router.visit(indexRoute.url()),
    });
  };

  const calculateShippingCost = (weight: number) => {
    return courier.base_rate + (weight * courier.per_kg_rate);
  };

  return (
    <Layout title={`Courier Details - ${courier.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{courier.name}</h1>
              <Badge variant={courier.is_active ? 'default' : 'secondary'}>
                {courier.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {courier.code && (
                <Badge variant="outline">{courier.code}</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              View and manage courier service details
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.visit(indexRoute.url())}
            >
              <BackIcon className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              variant="default"
              asChild
            >
              <InertiaLink href={editRoute.url({ courier: courier.id })}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </InertiaLink>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Courier Name</p>
                <p className="text-lg font-semibold">{courier.name}</p>
              </div>
              {courier.branch && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Branch</p>
                  <p className="text-lg">{courier.branch}</p>
                </div>
              )}
              {courier.code && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courier Code</p>
                  <p className="text-lg">{courier.code}</p>
                </div>
              )}
              {courier.contact_person && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                  <p className="text-lg">{courier.contact_person}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={courier.is_active ? 'default' : 'secondary'} className="mt-1">
                  {courier.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courier.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-lg">{courier.phone}</p>
                  </div>
                </div>
              )}
              {courier.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a href={`mailto:${courier.email}`} className="text-lg text-blue-600 hover:underline">
                      {courier.email}
                    </a>
                  </div>
                </div>
              )}
              {courier.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                    <a href={courier.website} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-600 hover:underline">
                      {courier.website}
                    </a>
                  </div>
                </div>
              )}
              {courier.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-lg">{courier.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Base Rate</p>
                <p className="text-2xl font-bold">৳{courier.base_rate.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Minimum charge per shipment</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Per Kg Rate</p>
                <p className="text-2xl font-bold">৳{courier.per_kg_rate.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Additional charge per kilogram</p>
              </div>
              
              {/* Example Calculations */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-2">Example Costs:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1 kg:</span>
                    <span className="font-medium">৳{calculateShippingCost(1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">5 kg:</span>
                    <span className="font-medium">৳{calculateShippingCost(5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">10 kg:</span>
                    <span className="font-medium">৳{calculateShippingCost(10).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details & Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courier.coverage_areas && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coverage Areas</p>
                  <p className="text-base mt-1">{courier.coverage_areas}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                <p className="text-2xl font-bold">{shipmentsCount}</p>
              </div>
              
              {courier.notes && (
                <div className="border-t pt-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notes</p>
                      <p className="text-base mt-1">{courier.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timestamps */}
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span> {new Date(courier.created_at).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {new Date(courier.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the courier "{courier.name}". This action cannot be undone.
                {shipmentsCount > 0 && (
                  <p className="mt-2 text-destructive font-semibold">
                    Warning: This courier has {shipmentsCount} shipment(s) associated with it.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

