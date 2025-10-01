import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  BarChart3 as TrialBalanceIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, create as createRoute, show as showRoute, edit as editRoute, destroy as destroyRoute, trialBalance as trialBalanceRoute } from '@/routes/accounts';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  sub_type?: string;
  parent_id?: number;
  opening_balance: number;
  is_active: boolean;
  parent_account?: Account;
  child_accounts: Account[];
  created_at: string;
}

interface AccountsIndexProps {
  accounts: {
    data: Account[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  };
  filters: {
    search?: string;
    type?: string;
    sub_type?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function AccountsIndex({ accounts, filters }: AccountsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const [subTypeFilter, setSubTypeFilter] = useState(filters.sub_type || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'code');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      type: typeFilter,
      sub_type: subTypeFilter,
      per_page: perPage,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
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
    router.get(indexRoute.url(), {
      search: searchTerm,
      type: typeFilter,
      sub_type: subTypeFilter,
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

  const confirmDelete = () => {
    if (accountToDelete) {
      router.delete(destroyRoute.url({ account: accountToDelete.id }));
    }
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'asset':
        return 'default';
      case 'liability':
        return 'destructive';
      case 'equity':
        return 'secondary';
      case 'income':
        return 'outline';
      case 'expense':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const accountTypes = [
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  return (
    <Layout title="Chart of Accounts">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
            <p className="text-muted-foreground">
              Manage your accounting chart of accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.visit(trialBalanceRoute.url())}>
              <TrialBalanceIcon className="mr-2 h-4 w-4" />
              Trial Balance
            </Button>
            <Button onClick={() => router.visit(createRoute.url())}>
              <AddIcon className="mr-2 h-4 w-4" />
              New Account
            </Button>
          </div>
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
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sub_type">Sub Type</Label>
                <Input
                  id="sub_type"
                  placeholder="Sub type..."
                  value={subTypeFilter}
                  onChange={(e) => setSubTypeFilter(e.target.value)}
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
                    setSearchTerm('');
                    setTypeFilter('');
                    setPerPage(15);
                    router.get('/accounts', {}, { preserveState: true, replace: true });
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts ({accounts?.meta?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts?.data?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <h3 className="text-lg font-semibold">No accounts found</h3>
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
                          onClick={() => handleSort('code')}
                        >
                          <div className="flex items-center gap-2">
                            Code
                            {getSortIcon('code')}
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
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('type')}
                        >
                          <div className="flex items-center gap-2">
                            Type
                            {getSortIcon('type')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('sub_type')}
                        >
                          <div className="flex items-center gap-2">
                            Sub Type
                            {getSortIcon('sub_type')}
                          </div>
                        </Button>
                      </TableHead>
                      <TableHead>Parent Account</TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort('opening_balance')}
                        >
                          <div className="flex items-center gap-2">
                            Opening Balance
                            {getSortIcon('opening_balance')}
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
                    {accounts?.data?.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.code}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeVariant(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{account.sub_type || 'N/A'}</TableCell>
                        <TableCell>{account.parent_account?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">${account.opening_balance.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={account.is_active ? 'default' : 'secondary'}>
                            {account.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.visit(showRoute.url({ account: account.id }))}
                            >
                              <ViewIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.visit(editRoute.url({ account: account.id }))}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(account)}
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

            {/* Pagination */}
            {accounts?.links && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  {accounts?.links?.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      onClick={() => link.url && router.visit(link.url)}
                      disabled={!link.url}
                      size="sm"
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete account {accountToDelete?.name}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}