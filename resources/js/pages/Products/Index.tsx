import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryCombobox } from '@/components/CategoryCombobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Eye as ViewIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/products';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  cost_price: number;
  unit: string;
  is_active: boolean;
  category: {
    name: string;
  };
  images: Array<{
    id: number;
    image_path: string;
    is_primary: boolean;
    image_url: string;
  }>;
}

interface ProductsIndexProps {
  products: {
    data: Product[];
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
  categories: Array<{
    id: number;
    name: string;
  }>;
  filters: {
    search?: string;
    category_id?: number;
    status?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
  };
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category_id?.toString() || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

  const handleSearch = (page: number = 1) => {
    router.get('/products', {
      search: search || undefined,
      category_id: categoryFilter || undefined,
      status: statusFilter || undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
      page: page,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(destroyRoute.url({ product: productId }));
    }
  };

  const handleSort = (column: string) => {
    let newDirection = 'asc';
    
    if (sortBy === column) {
      // If clicking the same column, toggle direction
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(column);
    setSortDirection(newDirection);
    
    // Trigger search with new sort parameters and reset to page 1
    router.get('/products', {
      search: search || undefined,
      category_id: categoryFilter || undefined,
      status: statusFilter || undefined,
      sort_by: column,
      sort_direction: newDirection,
      page: 1,
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

  return (
    <Layout title="Products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <Button asChild>
            <Link href={createRoute.url()}>
              <AddIcon className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <CategoryCombobox
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  placeholder="Select category..."
                  showAllOption={true}
                />
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
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="sku">SKU</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="cost_price">Cost Price</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                    <SelectItem value="is_active">Status</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sortDirection">Order</Label>
                <Select value={sortDirection} onValueChange={setSortDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="default" onClick={() => handleSearch()} className="w-full">
                  <SearchIcon className="mr-1 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('sku')}
                        >
                          <div className="flex items-center gap-2">
                            SKU
                            {getSortIcon('sku')}
                          </div>
                        </Button>
                      </TableHead>
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
                      <TableHead>Category</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center gap-2">
                            Price
                            {getSortIcon('price')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('cost_price')}
                        >
                          <div className="flex items-center gap-2">
                            Cost Price
                            {getSortIcon('cost_price')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('unit')}
                        >
                          <div className="flex items-center gap-2">
                            Unit
                            {getSortIcon('unit')}
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
                    {products.data.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border">
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>${product.cost_price.toFixed(2)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <Link href={showRoute.url({ product: product.id })}>
                                <ViewIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <Link href={editRoute.url({ product: product.id })}>
                                <EditIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(product.id)}
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

        {/* Custom Pagination */}
        <CustomPagination
          className="mt-6"
          pagination={products}
          onPageChange={handlePageChange}
          showPerPageOptions={false}
          showInfo={true}
          showFirstLast={true}
          maxVisiblePages={5}
        />
      </div>
    </Layout>
  );
}
