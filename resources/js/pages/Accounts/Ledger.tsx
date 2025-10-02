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
  ArrowLeft as BackIcon,
  Printer as PrintIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, ledger as ledgerRoute } from '@/routes/accounts';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  sub_type?: string;
  opening_balance: number;
}

interface User {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  transaction_date: string;
  reference_type: string | null;
  reference_id: number | null;
  debit: number;
  credit: number;
  description: string;
  balance: number;
  created_by: User;
}

interface LedgerProps {
  account: Account;
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  filters: {
    date_from?: string;
    date_to?: string;
    per_page?: number;
  };
}

export default function Ledger({ account, transactions, filters }: LedgerProps) {
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 50);

  const handleSearch = () => {
    router.get(ledgerRoute.url({ account: account.id }), {
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(ledgerRoute.url({ account: account.id }), {
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
      page,
    });
  };

  const handlePrint = () => {
    window.print();
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
    <Layout title={`Account Ledger - ${account.name}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Ledger</h1>
            <p className="text-muted-foreground">
              Transaction history for {account.name} ({account.code})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Accounts
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <PrintIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="text-lg font-semibold">{account.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="text-lg font-semibold">{account.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <Badge className="mt-1">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  {account.sub_type && ` - ${account.sub_type.replace('_', ' ')}`}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-lg font-semibold">{formatCurrency(account.opening_balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <SelectItem value="25">25 Items</SelectItem>
                    <SelectItem value="50">50 Items</SelectItem>
                    <SelectItem value="100">100 Items</SelectItem>
                    <SelectItem value="200">200 Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                      setPerPage(50);
                      router.get(ledgerRoute.url({ account: account.id }), {}, { preserveState: true, replace: true });
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ledger Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({transactions.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Created By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No transactions found for this account
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {/* Opening Balance Row */}
                      <TableRow className="bg-muted/30 font-medium">
                        <TableCell colSpan={3}>Opening Balance</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(account.opening_balance)}
                        </TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      
                      {/* Transaction Rows */}
                      {transactions.data.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {transaction.reference_type && (
                              <Badge variant="outline" className="text-xs">
                                {transaction.reference_type} #{transaction.reference_id}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600">
                            {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(transaction.balance)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.created_by.name}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Totals Row */}
                      <TableRow className="bg-muted/50 font-semibold border-t-2">
                        <TableCell colSpan={3} className="text-right">Total on Page:</TableCell>
                        <TableCell className="text-right text-green-600">{formatCurrency(totals.debit)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatCurrency(totals.credit)}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>

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

