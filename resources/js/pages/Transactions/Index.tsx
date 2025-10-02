import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import { AccountCombobox } from '@/components/AccountCombobox';
import {
  Search as SearchIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute } from '@/routes/transactions';

interface Account {
  id: number;
  code: string;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  account: Account;
  transaction_date: string;
  reference_type: string | null;
  reference_id: number | null;
  debit: number;
  credit: number;
  description: string;
  created_by: User;
  created_at: string;
}

interface TransactionsIndexProps {
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  accounts: Account[];
  filters: {
    search?: string;
    account_id?: string;
    reference_type?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function TransactionsIndex({ transactions, accounts, filters }: TransactionsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [accountFilter, setAccountFilter] = useState(filters.account_id?.toString() || 'all');
  const [referenceTypeFilter, setReferenceTypeFilter] = useState(filters.reference_type || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'transaction_date');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      account_id: accountFilter === 'all' ? undefined : accountFilter,
      reference_type: referenceTypeFilter === 'all' ? undefined : referenceTypeFilter,
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

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      account_id: accountFilter === 'all' ? undefined : accountFilter,
      reference_type: referenceTypeFilter === 'all' ? undefined : referenceTypeFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
      page,
    });
  };

  const handleSort = (column: string) => {
    let newDirection = 'asc';
    
    if (sortBy === column) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(column);
    setSortDirection(newDirection);
    
    router.get(indexRoute.url(), {
      search: searchTerm,
      account_id: accountFilter === 'all' ? undefined : accountFilter,
      reference_type: referenceTypeFilter === 'all' ? undefined : referenceTypeFilter,
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

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <SortIcon className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <SortAscIcon className="h-4 w-4 text-primary" />
      : <SortDescIcon className="h-4 w-4 text-primary" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate totals
  const totals = transactions.data.reduce((acc, transaction) => {
    return {
      debit: acc.debit + transaction.debit,
      credit: acc.credit + transaction.credit,
    };
  }, { debit: 0, credit: 0 });

  return (
    <Layout title="Transactions - View all accounting transactions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View all accounting transactions (double-entry bookkeeping)
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <AccountCombobox
                  value={accountFilter === 'all' ? '' : accountFilter}
                  onValueChange={(value) => setAccountFilter(value || 'all')}
                  placeholder="All Accounts"
                  showAllOption={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference_type">Reference Type</Label>
                <Select value={referenceTypeFilter} onValueChange={setReferenceTypeFilter}>
                  <SelectTrigger id="reference_type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="bank_transaction">Bank Transaction</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
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
                  <SelectTrigger id="per_page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Items</SelectItem>
                    <SelectItem value="30">30 Items</SelectItem>
                    <SelectItem value="50">50 Items</SelectItem>
                    <SelectItem value="100">100 Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setAccountFilter('all');
                  setReferenceTypeFilter('all');
                  setDateFrom('');
                  setDateTo('');
                  setPerPage(15);
                  router.get(indexRoute.url(), {}, { preserveState: true, replace: true });
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({transactions.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('transaction_date')}
                      className="h-8 flex items-center gap-1"
                    >
                      Date
                      {getSortIcon('transaction_date')}
                    </Button>
                  </TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('debit')}
                      className="h-8 flex items-center gap-1 ml-auto"
                    >
                      Debit
                      {getSortIcon('debit')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('credit')}
                      className="h-8 flex items-center gap-1 ml-auto"
                    >
                      Credit
                      {getSortIcon('credit')}
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {transactions.data.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.account.name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.account.code}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {transaction.reference_type && (
                            <Badge variant="outline">
                              {transaction.reference_type} #{transaction.reference_id}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.created_by.name}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals Row */}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={2} className="text-right">Total on Page:</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.debit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.credit)}</TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>

            {transactions.total > 0 && (
              <CustomPagination
                className="mt-6"
                pagination={transactions}
                onPageChange={handlePageChange}
                showPerPageOptions={false}
                showInfo={true}
                showFirstLast={true}
                maxVisiblePages={5}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

