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
  Truck,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { cn } from '@/lib/utils';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/couriers';

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
}

interface CouriersIndexProps {
  couriers: {
    data: Courier[];
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
    sort_field?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function CouriersIndex({ couriers, filters }: CouriersIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortField, setSortField] = useState(filters.sort_field || 'name');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courierToDelete, setCourierToDelete] = useState<Courier | null>(null);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      per_page: perPage,
      sort_field: sortField,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (courier: Courier) => {
    setCourierToDelete(courier);
    setDeleteDialogOpen(true);
  };

  const handleSort = (column: string) => {
    let newDirection = 'asc';
    
    if (sortField === column) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortField(column);
    setSortDirection(newDirection);

    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      per_page: perPage,
      sort_field: column,
      sort_direction: newDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const confirmDelete = () => {
    if (courierToDelete) {
      router.delete(destroyRoute.url({ courier: courierToDelete.id }), {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCourierToDelete(null);
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      per_page: perPage,
      sort_field: sortField,
      sort_direction: sortDirection,
      page,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getSortIcon = (column: string) => {
    if (sortField !== column) return <SortIcon className="ml-1 h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <SortAscIcon className="ml-1 h-4 w-4" />
      : <SortDescIcon className="ml-1 h-4 w-4" />;
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Couriers</h1>
            <p className="text-sm text-muted-foreground">Manage your courier services and shipping partners</p>
          </div>
          <Button asChild>
            <InertiaLink href={createRoute.url()}>
              <AddIcon className="mr-2 h-4 w-4" />
              Add Courier
            </InertiaLink>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, code, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value);
                  router.get(indexRoute.url(), {
                    search: searchTerm,
                    status: value === 'all' ? '' : value,
                    per_page: perPage,
                    sort_field: sortField,
                    sort_direction: sortDirection,
                  }, { preserveState: true, replace: true });
                }}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Per Page */}
              <div className="space-y-2">
                <Label htmlFor="perPage">Per Page</Label>
                <Select value={perPage.toString()} onValueChange={(value) => {
                  setPerPage(Number(value));
                  router.get(indexRoute.url(), {
                    search: searchTerm,
                    status: statusFilter === 'all' ? '' : statusFilter,
                    per_page: value,
                    sort_field: sortField,
                    sort_direction: sortDirection,
                  }, { preserveState: true, replace: true });
                }}>
                  <SelectTrigger id="perPage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Items</SelectItem>
                    <SelectItem value="15">15 Items</SelectItem>
                    <SelectItem value="25">25 Items</SelectItem>
                    <SelectItem value="50">50 Items</SelectItem>
                    <SelectItem value="100">100 Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPerPage(15);
                      setSortField('name');
                      setSortDirection('asc');
                      router.get(indexRoute.url());
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center hover:text-foreground"
                      >
                        Name {getSortIcon('name')}
                      </button>
                    </TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('code')}
                        className="flex items-center hover:text-foreground"
                      >
                        Code {getSortIcon('code')}
                      </button>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('base_rate')}
                        className="flex items-center hover:text-foreground"
                      >
                        Base Rate {getSortIcon('base_rate')}
                      </button>
                    </TableHead>
                    <TableHead>Per Kg</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couriers.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No couriers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    couriers.data.map((courier) => (
                      <TableRow key={courier.id}>
                        <TableCell className="font-medium">{courier.name}</TableCell>
                        <TableCell>
                          {courier.branch && (
                            <span className="text-sm text-muted-foreground">{courier.branch}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {courier.code && (
                            <Badge variant="outline">{courier.code}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {courier.phone && <div>{courier.phone}</div>}
                            {courier.email && <div className="text-muted-foreground">{courier.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell>৳{courier.base_rate.toFixed(2)}</TableCell>
                        <TableCell>৳{courier.per_kg_rate.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {courier.coverage_areas || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={courier.is_active ? 'default' : 'secondary'}>
                            {courier.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                            >
                              <InertiaLink href={showRoute.url({ courier: courier.id })}>
                                <ViewIcon className="h-4 w-4" />
                              </InertiaLink>
                            </Button>
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                            >
                              <InertiaLink href={editRoute.url({ courier: courier.id })}>
                                <EditIcon className="h-4 w-4" />
                              </InertiaLink>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(courier)}
                            >
                              <DeleteIcon className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Custom Pagination */}
            <CustomPagination
              className="mt-6"
              pagination={couriers}
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the courier "{courierToDelete?.name}". 
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

