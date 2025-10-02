import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
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
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
  DollarSign,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { cn } from '@/lib/utils';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/customers';

interface Customer {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  credit_limit: number;
  outstanding_amount: number;
  is_active: boolean;
  created_at: string;
}

interface CustomersIndexProps {
  customers: {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters: {
    search?: string;
    status?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
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
      status: statusFilter === 'all' ? '' : statusFilter,
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
      status: statusFilter === 'all' ? '' : statusFilter,
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
    if (customerToDelete) {
      router.delete(destroyRoute.url({ customer: customerToDelete.id }));
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <Layout title="Customers">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer information and relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit('/reports/customer-outstanding')} className="bg-orange-50 hover:bg-orange-100">
              <DollarSign className="mr-2 h-4 w-4" />
              Receivables
            </Button>
            <Button onClick={() => router.visit(createRoute.url())}>
              <AddIcon className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="flex gap-2">
                <Button variant="default" onClick={handleSearch}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPerPage(15);
                  router.get(indexRoute.url(), {}, { preserveState: true, replace: true });
                }}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {getSortIcon('name')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('code')}
                      >
                        <div className="flex items-center gap-2">
                          Code
                          {getSortIcon('code')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('contact_person')}
                      >
                        <div className="flex items-center gap-2">
                          Contact Person
                          {getSortIcon('contact_person')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('phone')}
                      >
                        <div className="flex items-center gap-2">
                          Phone
                          {getSortIcon('phone')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('credit_limit')}
                      >
                        <div className="flex items-center gap-2">
                          Credit Limit
                          {getSortIcon('credit_limit')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('outstanding_amount')}
                      >
                        <div className="flex items-center gap-2">
                          Outstanding
                          {getSortIcon('outstanding_amount')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('is_active')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {getSortIcon('is_active')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.data.length > 0 ? (
                    customers.data.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.code}</TableCell>
                        <TableCell>{customer.contact_person || 'N/A'}</TableCell>
                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                        <TableCell>{customer.email || 'N/A'}</TableCell>
                        <TableCell className="text-right">${customer.credit_limit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${customer.outstanding_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                            {customer.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/customers/${customer.id}`)}
                            >
                              <ViewIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/customers/${customer.id}/edit`)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDelete(customer)}
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Custom Pagination */}
            <CustomPagination
              className="mt-6"
              pagination={customers}
              onPageChange={handlePageChange}
              showPerPageOptions={false}
              showInfo={true}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete customer <span className="font-semibold">{customerToDelete?.name}</span>?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
