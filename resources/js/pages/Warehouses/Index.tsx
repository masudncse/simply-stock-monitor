import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Search as SearchIcon,
  Plus as AddIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
  Building2 as WarehouseIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

interface WarehousesIndexProps {
  warehouses: {
    data: Warehouse[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters: {
    search?: string;
    status?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    per_page?: number;
  };
}


export default function WarehousesIndex({ warehouses, filters }: WarehousesIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

  const handleSearch = () => {
    router.get('/warehouses', {
      search: search || undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSort = (column: string) => {
    let newDirection = 'asc';
    
    if (sortBy === column) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(column);
    setSortDirection(newDirection);
    
    router.get('/warehouses', {
      search: search || undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      per_page: perPage,
      sort_by: column,
      sort_direction: newDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get('/warehouses', {
      search: search || undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
      page: page,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <SortIcon className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />;
  };

  const handleDelete = (warehouse: Warehouse) => {
    if (confirm(`Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`)) {
      router.delete(`/warehouses/${warehouse.id}`, {
        onSuccess: () => {
          // Handle success if needed
        },
        onError: (errors) => {
          console.error('Delete failed:', errors);
        }
      });
    }
  };

  return (
    <Layout title="Warehouse Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WarehouseIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Warehouse Management</h1>
              <p className="text-muted-foreground">
                Manage your warehouses and storage locations
              </p>
            </div>
          </div>
          <Link href="/warehouses/create">
            <Button>
              <AddIcon className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </Link>
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
                    placeholder="Search warehouses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
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

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button variant="default" onClick={handleSearch} className="flex-1">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    setPerPage(15);
                    router.get('/warehouses', {}, { preserveState: true, replace: true });
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {warehouses.from || 0} to {warehouses.to || 0} of {warehouses.total} warehouses
          </div>
        </div>

        {/* Warehouses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            {warehouses.data.length === 0 ? (
              <div className="text-center py-12">
                <WarehouseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
                <p className="text-muted-foreground mb-4">
                  {search || statusFilter ? 'Try adjusting your filters' : 'Get started by creating your first warehouse'}
                </p>
                {!search && !statusFilter && (
                  <Link href="/warehouses/create">
                    <Button>
                      <AddIcon className="mr-2 h-4 w-4" />
                      Create Warehouse
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('code')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Code</span>
                          {getSortIcon('code')}
                        </div>
                      </TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('is_active')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {getSortIcon('is_active')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Created</span>
                          {getSortIcon('created_at')}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouses.data.map((warehouse) => (
                      <TableRow key={warehouse.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{warehouse.name}</div>
                            {warehouse.address && (
                              <div className="text-sm text-muted-foreground">
                                {warehouse.address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{warehouse.code}</Badge>
                        </TableCell>
                        <TableCell>{warehouse.contact_person || '-'}</TableCell>
                        <TableCell>{warehouse.phone || '-'}</TableCell>
                        <TableCell>{warehouse.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                            {warehouse.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(warehouse.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/warehouses/${warehouse.id}`}>
                              <Button variant="ghost" size="sm">
                                <ViewIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/warehouses/${warehouse.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(warehouse)}
                              className="text-destructive hover:text-destructive"
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
          </CardContent>
        </Card>

        {/* Pagination */}
        {warehouses.last_page > 1 && (
          <CustomPagination
            className="mt-6"
            pagination={warehouses}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
}
