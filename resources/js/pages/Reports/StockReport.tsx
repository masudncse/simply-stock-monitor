import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryCombobox } from '@/components/CategoryCombobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package as InventoryIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Stock {
  id: number;
  qty: number;
  cost_price: number;
  batch?: string;
  expiry_date?: string;
  product: {
    id: number;
    name: string;
    sku: string;
    min_stock: number;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface StockReportProps {
  stocks: Stock[];
  totalValuation: number;
  warehouses: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  filters: {
    warehouse_id?: number;
    category_id?: number;
    low_stock?: boolean;
  };
}

const StockReport: React.FC<StockReportProps> = ({
  stocks,
  totalValuation,
  warehouses,
  categories,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: string | number | boolean) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/stock', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/stock', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'stock',
      data: stocks,
    });
  };

  const getStockStatus = (stock: Stock) => {
    if (stock.qty <= stock.product.min_stock) {
      return { label: 'Low Stock', variant: 'destructive' as const };
    } else if (stock.qty <= stock.product.min_stock * 1.5) {
      return { label: 'Medium Stock', variant: 'secondary' as const };
    } else {
      return { label: 'Good Stock', variant: 'default' as const };
    }
  };

  return (
    <Layout title="Stock Report">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <InventoryIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Stock Report</h1>
          </div>
          <p className="text-muted-foreground">
            Current stock levels and valuation across all warehouses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stocks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Valuation</p>
                <p className="text-2xl font-bold">${totalValuation.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-destructive">
                  {stocks.filter(stock => stock.qty <= stock.product.min_stock).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Warehouses</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={localFilters.warehouse_id?.toString() || "all"} onValueChange={(value) => handleFilterChange('warehouse_id', value === "all" ? "" : parseInt(value))}>
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
                <Label htmlFor="category">Category</Label>
                <CategoryCombobox
                  value={localFilters.category_id?.toString() || ""}
                  onValueChange={(value) => handleFilterChange('category_id', value === "" ? "" : parseInt(value))}
                  placeholder="All Categories"
                  showAllOption={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_status">Stock Status</Label>
                <Select value={localFilters.low_stock ? "low" : "all"} onValueChange={(value) => handleFilterChange('low_stock', value === "low")}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="low">Low Stock Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button onClick={applyFilters}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Stock Details ({stocks.length} items)
          </h2>
          <Button onClick={exportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stock Table */}
        <Card>
          <CardContent>
            {stocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Alert>
                  <AlertDescription>
                    No stock data found for the selected filters.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Min Stock</TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Batch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock) => {
                      const status = getStockStatus(stock);
                      return (
                        <TableRow key={`${stock.product.id}-${stock.warehouse.id}`}>
                          <TableCell className="font-medium">{stock.product.name}</TableCell>
                          <TableCell>{stock.product.sku}</TableCell>
                          <TableCell>{stock.warehouse.name}</TableCell>
                          <TableCell className="text-right">{stock.qty}</TableCell>
                          <TableCell className="text-right">{stock.product.min_stock}</TableCell>
                          <TableCell className="text-right">${stock.cost_price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${(stock.qty * stock.cost_price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{stock.batch || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StockReport;