import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/suppliers';

interface Supplier {
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

interface SuppliersIndexProps {
  suppliers: {
    data: Supplier[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
    meta?: { current_page: number; last_page: number; per_page: number; total: number };
  };
  filters: {
    search?: string;
    status?: string;
  };
}

export default function SuppliersIndex({ suppliers, filters }: SuppliersIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      router.delete(destroyRoute.url({ supplier: supplierToDelete.id }));
    }
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  return (
    <Layout title="Suppliers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage your supplier relationships and contact information
            </p>
          </div>
          <Button onClick={() => router.visit(createRoute.url())}>
            <AddIcon className="mr-2 h-4 w-4" />
            New Supplier
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search suppliers..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={handleSearch} className="w-full">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Credit Limit</TableCell>
                    <TableCell>Outstanding</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.data.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.code}</TableCell>
                      <TableCell>{supplier.contact_person || 'N/A'}</TableCell>
                      <TableCell>{supplier.phone || 'N/A'}</TableCell>
                      <TableCell>{supplier.email || 'N/A'}</TableCell>
                      <TableCell>${supplier.credit_limit.toFixed(2)}</TableCell>
                      <TableCell>${supplier.outstanding_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.is_active ? 'Active' : 'Inactive'}
                          color={supplier.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(showRoute.url({ supplier: supplier.id }))}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(editRoute.url({ supplier: supplier.id }))}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(supplier)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {suppliers.links && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {suppliers.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
                  <Button
                    key={index}
                    variant={link.active ? 'contained' : 'outlined'}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={!link.url}
                    sx={{ mx: 0.5 }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete supplier {supplierToDelete?.name}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
}
