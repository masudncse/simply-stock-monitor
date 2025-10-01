import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  CheckCircle as ProcessIcon,
  Printer as PrintIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute, process as processRoute } from '@/routes/sales';

interface Customer {
  id: number;
  name: string;
  code: string;
}

interface SaleItem {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  customer: Customer | null;
  warehouse: {
    id: number;
    name: string;
  } | null;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  notes?: string;
  sale_items: SaleItem[];
  created_at: string;
}

interface SalesIndexProps {
  sales: {
    data: Sale[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
  };
  customers: Customer[];
  filters: {
    search?: string;
    status?: string;
    customer_id?: number;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function SalesIndex({ sales, customers, filters }: SalesIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [customerFilter, setCustomerFilter] = useState(filters.customer_id?.toString() || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter,
      customer_id: customerFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (sale: Sale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };

  const handleSort = (column: string) => {
    let newDirection = 'asc';
    
    if (sortBy === column) {
      // If clicking the same column, toggle direction
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(column);
    setSortDirection(newDirection);
    
    // Trigger search with new sort parameters
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter,
      customer_id: customerFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
      sort_by: column,
      sort_direction: newDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter,
      customer_id: customerFilter,
      date_from: dateFrom,
      date_to: dateTo,
      sort_by: sortBy,
      sort_direction: sortDirection,
      page,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <SortIcon className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <SortAscIcon className="h-4 w-4 text-primary" />
      : <SortDescIcon className="h-4 w-4 text-primary" />;
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      router.delete(destroyRoute.url({ sale: saleToDelete.id }));
    }
    setDeleteDialogOpen(false);
    setSaleToDelete(null);
  };

  const handleProcess = (sale: Sale) => {
    router.post(processRoute.url({ sale: sale.id }));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'default';
      case 'partial':
        return 'outline';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout title="Sales - View and manage sales transactions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground">
              Manage your sales orders and customer transactions
            </p>
          </div>
          <Button onClick={() => router.visit(createRoute.url())}>
            <AddIcon className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <CustomerCombobox
                  value={customerFilter || ""}
                  onValueChange={(value) => setCustomerFilter(value === "" ? "" : value)}
                  placeholder="All Customers"
                  showAllOption={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_from">Date From</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_to">Date To</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="per_page">Per Page</Label>
                <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Items</SelectItem>
                    <SelectItem value="30">30 Items</SelectItem>
                    <SelectItem value="50">50 Items</SelectItem>
                    <SelectItem value="75">75 Items</SelectItem>
                    <SelectItem value="100">100 Items</SelectItem>
                    <SelectItem value="200">200 Items</SelectItem>
                    <SelectItem value="500">500 Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button variant="default" onClick={handleSearch} className="flex-1">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setCustomerFilter('');
                    setStatusFilter('');
                    setDateFrom('');
                    setDateTo('');
                    setPerPage(15);
                    router.get('/sales', {}, { preserveState: true, replace: true });
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales ({sales.meta?.total || sales.data.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <h3 className="text-lg font-semibold">No sales found</h3>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('invoice_number')}
                        >
                          <div className="flex items-center gap-2">
                            Invoice #
                            {getSortIcon('invoice_number')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('sale_date')}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {getSortIcon('sale_date')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('total_amount')}
                        >
                          <div className="flex items-center gap-2">
                            Total Amount
                            {getSortIcon('total_amount')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {getSortIcon('status')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.data.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                        <TableCell>{sale.customer?.name || 'N/A'}</TableCell>
                        <TableCell>{sale.warehouse?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">${sale.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(sale.status)}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusVariant(sale.payment_status)}>
                            {sale.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.visit(showRoute.url({ sale: sale.id }))}
                            >
                              <ViewIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.visit(editRoute.url({ sale: sale.id }))}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`/sales/${sale.id}/print`, '_blank')}
                            >
                              <PrintIcon className="h-4 w-4" />
                            </Button>
                            {sale.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                                onClick={() => handleProcess(sale)}
                              >
                                <ProcessIcon className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(sale)}
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Custom Pagination */}
            <CustomPagination
              className="mt-6"
              pagination={sales}
              onPageChange={handlePageChange}
              showPerPageOptions={false}
              showInfo={true}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete sale {saleToDelete?.invoice_number}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
