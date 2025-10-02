import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Truck as ShipmentIcon,
  Printer as PrintIcon,
  Trash2 as DeleteIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, create as createRoute, show as showRoute, destroy as destroyRoute, print as printRoute } from '@/routes/shipments';

interface Customer {
  id: number;
  name: string;
  code: string;
}

interface Sale {
  id: number;
  invoice_number: string;
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
  recipient_district: string | null;
  shipping_cost: number;
  is_paid: boolean;
  created_by: User;
}

interface ShipmentsIndexProps {
  shipments: {
    data: Shipment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  filters: {
    search?: string;
    status?: string;
    courier_service?: string;
    date_from?: string;
    date_to?: string;
    per_page?: number;
  };
}

export default function ShipmentsIndex({ shipments, filters }: ShipmentsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [courierFilter, setCourierFilter] = useState(filters.courier_service || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      courier_service: courierFilter === 'all' ? undefined : courierFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      courier_service: courierFilter === 'all' ? undefined : courierFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
      page,
    });
  };

  const handleDelete = (shipmentId: number) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      router.delete(destroyRoute.url({ shipment: shipmentId }));
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
    <Layout title="Shipments - Track deliveries and courier services">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">
              Track deliveries via courier services
            </p>
          </div>
          <Button onClick={() => router.visit(createRoute.url())}>
            <AddIcon className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Shipment #, tracking #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
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
              <div className="space-y-2">
                <Label>Courier Service</Label>
                <Select value={courierFilter} onValueChange={setCourierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Couriers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Couriers</SelectItem>
                    <SelectItem value="SA Poribahan">SA Poribahan</SelectItem>
                    <SelectItem value="Sundorbon Express">Sundorbon Express</SelectItem>
                    <SelectItem value="Janani">Janani</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="DHL">DHL</SelectItem>
                    <SelectItem value="Pathao Courier">Pathao Courier</SelectItem>
                    <SelectItem value="RedX">RedX</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleSearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Shipments ({shipments.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment #</TableHead>
                  <TableHead>Sale Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Shipping Date</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No shipments found
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.data.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipment_number}</TableCell>
                      <TableCell>{shipment.sale.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{shipment.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{shipment.customer.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.courier_service}</TableCell>
                      <TableCell className="text-sm">{shipment.tracking_number || '-'}</TableCell>
                      <TableCell>{new Date(shipment.shipping_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm">
                        {shipment.recipient_district || shipment.recipient_name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>
                          {getStatusLabel(shipment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(showRoute.url({ shipment: shipment.id }))}
                          >
                            <ViewIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(printRoute.url({ shipment: shipment.id }))}
                          >
                            <PrintIcon className="h-4 w-4" />
                          </Button>
                          {shipment.status !== 'delivered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(shipment.id)}
                            >
                              <DeleteIcon className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {shipments.total > 0 && (
              <CustomPagination
                className="mt-6"
                pagination={shipments}
                onPageChange={handlePageChange}
                showPerPageOptions={false}
                showInfo={true}
                showFirstLast={true}
                maxVisiblePages={5}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

