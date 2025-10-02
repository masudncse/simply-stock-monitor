import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCombobox } from '@/components/ProductCombobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Search as SearchIcon,
  AlertTriangle as WarningIcon,
  Settings as TuneIcon,
  ArrowRightLeft as SwapHorizIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Warehouse {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  min_stock: number;
}

interface Stock {
  id: number;
  qty: number;
  batch?: string;
  expiry_date?: string;
  cost_price: number;
  warehouse: Warehouse;
  product: Product;
}

interface StockIndexProps {
  stocks: {
    data: Stock[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  warehouses: Warehouse[];
  products: Product[];
  filters: {
    warehouse_id?: number;
    product_id?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function StockIndex({ stocks, warehouses, products, filters }: StockIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [warehouseFilter, setWarehouseFilter] = useState(filters.warehouse_id?.toString() || '');
  const [productFilter, setProductFilter] = useState(filters.product_id?.toString() || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'product_id');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

  const handleSearch = () => {
    router.get('/stock', {
      search: search || undefined,
      warehouse_id: warehouseFilter || undefined,
      product_id: productFilter || undefined,
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
      // If clicking the same column, toggle direction
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(column);
    setSortDirection(newDirection);
    
    // Trigger search with new sort parameters
    router.get('/stock', {
      search: search || undefined,
      warehouse_id: warehouseFilter || undefined,
      product_id: productFilter || undefined,
      per_page: perPage,
      sort_by: column,
      sort_direction: newDirection,
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

  const isLowStock = (stock: Stock) => {
    return stock.qty <= stock.product.min_stock;
  };

  return (
    <Layout title="Stock Management - Monitor and manage inventory levels">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage your inventory levels
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/stock/low-stock">
                <WarningIcon className="mr-2 h-4 w-4" />
                Low Stock
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/stock/adjust">
                <TuneIcon className="mr-2 h-4 w-4" />
                Adjust Stock
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/stock/transfer">
                <SwapHorizIcon className="mr-2 h-4 w-4" />
                Transfer Stock
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Products</Label>
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
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={warehouseFilter || "all"} onValueChange={(value) => setWarehouseFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <ProductCombobox
                  value={productFilter || ""}
                  onValueChange={(value) => setProductFilter(value === "" ? "" : value)}
                  placeholder="All Products"
                  showAllOption={true}
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
                    setSearch('');
                    setWarehouseFilter('');
                    setProductFilter('');
                    setPerPage(15);
                    router.get('/stock', {}, { preserveState: true, replace: true });
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Records ({stocks.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {stocks.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <h3 className="text-lg font-semibold">No stock records found</h3>
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
                          onClick={() => handleSort('product_id')}
                        >
                          <div className="flex items-center gap-2">
                            Product
                            {getSortIcon('product_id')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('warehouse_id')}
                        >
                          <div className="flex items-center gap-2">
                            Warehouse
                            {getSortIcon('warehouse_id')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('quantity')}
                        >
                          <div className="flex items-center gap-2">
                            Quantity
                            {getSortIcon('quantity')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('batch')}
                        >
                          <div className="flex items-center gap-2">
                            Batch
                            {getSortIcon('batch')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('expiry_date')}
                        >
                          <div className="flex items-center gap-2">
                            Expiry Date
                            {getSortIcon('expiry_date')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.data.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{stock.product.name}</TableCell>
                        <TableCell>{stock.product.sku}</TableCell>
                        <TableCell>{stock.warehouse.name}</TableCell>
                        <TableCell className="text-right">{stock.qty}</TableCell>
                        <TableCell>{stock.batch || 'N/A'}</TableCell>
                        <TableCell className="text-right">${stock.cost_price.toFixed(2)}</TableCell>
                        <TableCell>
                          {stock.expiry_date ? new Date(stock.expiry_date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isLowStock(stock) ? "destructive" : "default"}>
                            {isLowStock(stock) ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
