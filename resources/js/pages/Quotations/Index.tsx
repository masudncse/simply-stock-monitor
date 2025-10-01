import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Check as ApproveIcon,
  X as RejectIcon,
  ArrowRight as ConvertIcon,
  Printer as PrintIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Quotation {
  id: number;
  quotation_number: string;
  customer: {
    id: number;
    name: string;
    code: string;
  };
  warehouse: {
    id: number;
    name: string;
    code: string;
  };
  quotation_date: string;
  valid_until: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  creator: {
    id: number;
    name: string;
  };
  converted_to_sale_id?: number;
}

interface QuotationsIndexProps {
  quotations: {
    data: Quotation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters?: {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function QuotationsIndex({ quotations, filters = {} }: QuotationsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSearch = () => {
    router.get('/quotations', {
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
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
    router.get('/quotations', {
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
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

  const handleApprove = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/approve`);
  };

  const handleReject = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/reject`);
  };

  const handleSend = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/send`);
  };

  const handleConvertToSale = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/convert-to-sale`);
  };

  return (
    <Layout title="Quotations">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">
              Manage customer quotations and convert approved ones to sales
            </p>
          </div>
          <Button asChild>
            <Link href="/quotations/create">
              <AddIcon className="mr-2 h-4 w-4" />
              Create Quotation
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Per Page</label>
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
                <label className="text-sm font-medium">&nbsp;</label>
                <div className="flex gap-2">
                  <Button variant="default" onClick={handleSearch} className="flex-1">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFrom('');
                    setDateTo('');
                    setPerPage(15);
                    router.get('/quotations', {}, { preserveState: true, replace: true });
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quotations ({quotations.data.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {quotations.data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No quotations found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('quotation_number')}
                      >
                        <div className="flex items-center gap-2">
                          Quotation #
                          {getSortIcon('quotation_number')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('quotation_date')}
                      >
                        <div className="flex items-center gap-2">
                          Date
                          {getSortIcon('quotation_date')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('valid_until')}
                      >
                        <div className="flex items-center gap-2">
                          Valid Until
                          {getSortIcon('valid_until')}
                        </div>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort('total_amount')}
                      >
                        <div className="flex items-center gap-2">
                          Total
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
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.data.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/quotations/${quotation.id}`}
                          className="text-primary hover:underline"
                        >
                          {quotation.quotation_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quotation.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{quotation.customer.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(quotation.quotation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(quotation.valid_until).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(quotation.total_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(quotation.status)}>
                          {getStatusLabel(quotation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{quotation.creator.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotations/${quotation.id}`}>
                              <ViewIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          {quotation.status === 'draft' && (
                            <>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/quotations/${quotation.id}/edit`}>
                                  <EditIcon className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSend(quotation)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <SendIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {quotation.status === 'sent' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApprove(quotation)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <ApproveIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(quotation)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <RejectIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {quotation.status === 'approved' && !quotation.converted_to_sale_id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleConvertToSale(quotation)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <ConvertIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {quotation.converted_to_sale_id && (
                            <Badge variant="outline" className="text-xs">
                              Converted
                            </Badge>
                          )}
                          
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotations/${quotation.id}/print`} target="_blank">
                              <PrintIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
