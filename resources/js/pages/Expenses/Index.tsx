import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import { AccountCombobox } from '@/components/AccountCombobox';
import {
  Plus,
  Search as SearchIcon,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute } from '@/routes/expenses';

interface Account {
  id: number;
  code: string;
  name: string;
}

interface Expense {
  id: number;
  expense_number: string;
  account: Account;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  payment_mode: string;
  reference_number?: string;
  created_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface ExpensesIndexProps {
  expenses: {
    data: Expense[];
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
    category?: string;
    account_id?: number;
    date_from?: string;
    date_to?: string;
  };
}

export default function ExpensesIndex({ expenses, accounts, filters }: ExpensesIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
  const [accountFilter, setAccountFilter] = useState(filters.account_id?.toString() || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      account_id: accountFilter === 'all' ? undefined : accountFilter,
      date_from: dateFrom,
      date_to: dateTo,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), { ...filters, page });
  };

  const handleDelete = (expenseId: number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      router.delete(destroyRoute.url({ expense: expenseId }));
    }
  };

  return (
    <Layout title="Expenses - Manage business expenses and costs">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage business expenses
            </p>
          </div>
          <Button onClick={() => router.visit(createRoute.url())}>
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Expense number or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <div className="mt-4">
              <Button onClick={handleSearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses ({expenses.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.data.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.expense_number}</TableCell>
                      <TableCell>{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                      <TableCell className="text-sm">{expense.account.name}</TableCell>
                      <TableCell className="text-right font-semibold">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expense.payment_mode}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(`/expenses/${expense.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(editRoute.url({ expense: expense.id }))}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {expenses.total > 0 && (
              <CustomPagination
                className="mt-6"
                pagination={expenses}
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

