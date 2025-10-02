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
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Check as ApproveIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, show as showRoute, edit as editRoute, destroy as destroyRoute, approve as approveRoute } from '@/routes/sale-returns';

interface SaleReturn {
  id: number;
  return_number: string;
  sale: {
    id: number;
    invoice_number: string;
  };
  customer: {
    id: number;
    name: string;
  } | null;
  warehouse: {
    id: number;
    name: string;
  };
  return_date: string;
  total_amount: number;
  status: string;
  reason?: string;
  created_at: string;
}

interface SaleReturnsIndexProps {
  returns: {
    data: SaleReturn[];
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
    date_from?: string;
    date_to?: string;
    per_page?: number;
  };
}

export default function SaleReturnsIndex({ returns, filters }: SaleReturnsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (returnId: number) => {
    if (confirm('Are you sure you want to delete this return?')) {
      router.delete(destroyRoute.url({ saleReturn: returnId }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Sale Returns - View and manage product returns from customers">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sale Returns</h1>
          <p className="text-muted-foreground">
            View and manage product returns from customers
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Return number..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
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

        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Returns ({returns.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return #</TableHead>
                  <TableHead>Original Sale</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No sale returns found
                    </TableCell>
                  </TableRow>
                ) : (
                  returns.data.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.return_number}</TableCell>
                      <TableCell>{returnItem.sale.invoice_number}</TableCell>
                      <TableCell>{returnItem.customer?.name || 'N/A'}</TableCell>
                      <TableCell>{new Date(returnItem.return_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${returnItem.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(returnItem.status)}>
                          {returnItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{returnItem.reason || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(showRoute.url({ saleReturn: returnItem.id }))}
                          >
                            <ViewIcon className="h-4 w-4" />
                          </Button>
                          {returnItem.status === 'draft' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit(editRoute.url({ saleReturn: returnItem.id }))}
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(returnItem.id)}
                              >
                                <DeleteIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {returns.total > 0 && (
              <div className="mt-4">
                <CustomPagination
                  currentPage={returns.current_page}
                  lastPage={returns.last_page}
                  perPage={returns.per_page}
                  total={returns.total}
                  from={returns.from}
                  to={returns.to}
                  onPageChange={(page) => router.get(indexRoute.url(), { ...filters, page })}
                  onPerPageChange={(newPerPage) => {
                    setPerPage(newPerPage);
                    router.get(indexRoute.url(), { ...filters, per_page: newPerPage });
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

