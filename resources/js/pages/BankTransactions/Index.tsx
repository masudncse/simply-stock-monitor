import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import CustomPagination from '@/components/CustomPagination';
import { AccountCombobox } from '@/components/AccountCombobox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Search as SearchIcon,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, store as storeRoute, destroy as destroyRoute } from '@/routes/bank-transactions';

interface Account {
  id: number;
  code: string;
  name: string;
}

interface BankTransaction {
  id: number;
  transaction_number: string;
  transaction_type: 'deposit' | 'withdraw' | 'transfer';
  from_account: Account;
  to_account: Account;
  transaction_date: string;
  amount: number;
  reference_number?: string;
  description?: string;
  created_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface BankTransactionsIndexProps {
  transactions: {
    data: BankTransaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  cashAccounts: Account[];
  bankAccounts: Account[];
  filters: {
    search?: string;
    transaction_type?: string;
    date_from?: string;
    date_to?: string;
    per_page?: number;
  };
}

export default function BankTransactionsIndex({ 
  transactions, 
  cashAccounts, 
  bankAccounts, 
  filters 
}: BankTransactionsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.transaction_type || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [perPage, setPerPage] = useState(filters.per_page || 15);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Form state
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = () => {
    router.get(indexRoute.url(), {
      search: searchTerm,
      transaction_type: typeFilter === 'all' ? undefined : typeFilter,
      date_from: dateFrom,
      date_to: dateTo,
      per_page: perPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(indexRoute.url(), { ...filters, page });
  };

  const handleDelete = (transactionId: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      router.delete(destroyRoute.url({ bankTransaction: transactionId }));
    }
  };

  const handleOpenCreateModal = (type: 'deposit' | 'withdraw' | 'transfer') => {
    setTransactionType(type);
    
    // Auto-select accounts based on transaction type
    const cashAccount = cashAccounts.find(acc => acc.code === '1000');
    const bankAccount = bankAccounts.find(acc => acc.code === '1100');
    
    if (type === 'deposit') {
      // Cash → Bank
      setFromAccountId(cashAccount?.id.toString() || '');
      setToAccountId(bankAccount?.id.toString() || '');
      setDescription('Cash deposit to bank');
    } else if (type === 'withdraw') {
      // Bank → Cash
      setFromAccountId(bankAccount?.id.toString() || '');
      setToAccountId(cashAccount?.id.toString() || '');
      setDescription('Cash withdrawal from bank');
    } else {
      // Transfer
      setFromAccountId('');
      setToAccountId('');
      setDescription('Bank transfer');
    }
    
    setCreateModalOpen(true);
  };

  const handleSubmit = () => {
    const data = {
      transaction_type: transactionType,
      from_account_id: parseInt(fromAccountId),
      to_account_id: parseInt(toAccountId),
      transaction_date: transactionDate,
      amount: parseFloat(amount),
      reference_number: referenceNumber || null,
      description: description || null,
      notes: notes || null,
    };

    setIsSubmitting(true);
    router.post(storeRoute.url(), data, {
      onSuccess: () => {
        setCreateModalOpen(false);
        resetForm();
      },
      onError: (errors) => {
        console.error('Error creating transaction:', errors);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const resetForm = () => {
    setAmount('');
    setReferenceNumber('');
    setNotes('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="h-4 w-4 text-green-600" />;
      case 'withdraw':
        return <ArrowUpFromLine className="h-4 w-4 text-orange-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-500';
      case 'withdraw':
        return 'bg-orange-500';
      case 'transfer':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Bank Transactions - Manage deposits, withdrawals and transfers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank Transactions</h1>
            <p className="text-muted-foreground">
              Manage cash deposits, withdrawals and bank transfers
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleOpenCreateModal('deposit')} className="bg-green-600 hover:bg-green-700">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button onClick={() => handleOpenCreateModal('withdraw')} className="bg-orange-600 hover:bg-orange-700">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
            <Button onClick={() => handleOpenCreateModal('transfer')} className="bg-blue-600 hover:bg-blue-700">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transfer
            </Button>
          </div>
        </div>

        {/* Account Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {cashAccounts.map(account => (
                <div key={account.id} className="flex justify-between items-center">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-lg font-bold">$0.00</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bank Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {bankAccounts.map(account => (
                <div key={account.id} className="flex justify-between items-center">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-lg font-bold">$0.00</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Transaction number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdraw">Withdraw</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
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
            </div>
            <div className="mt-4">
              <Button onClick={handleSearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
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
                  <TableHead>Transaction #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From Account</TableHead>
                  <TableHead>To Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No bank transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.data.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transaction_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(transaction.transaction_type)}
                          <Badge className={getTypeColor(transaction.transaction_type)}>
                            {transaction.transaction_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.from_account.name}</TableCell>
                      <TableCell>{transaction.to_account.name}</TableCell>
                      <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-semibold">${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{transaction.reference_number || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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

        {/* Create Transaction Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {transactionType === 'deposit' && 'Deposit Cash to Bank'}
                {transactionType === 'withdraw' && 'Withdraw Cash from Bank'}
                {transactionType === 'transfer' && 'Transfer Between Accounts'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_date">Transaction Date</Label>
                  <Input
                    id="transaction_date"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_account">From Account *</Label>
                  <AccountCombobox
                    value={fromAccountId}
                    onValueChange={setFromAccountId}
                    placeholder="Select account"
                    showAllOption={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to_account">To Account *</Label>
                  <AccountCombobox
                    value={toAccountId}
                    onValueChange={setToAccountId}
                    placeholder="Select account"
                    showAllOption={false}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  placeholder="Cheque number, transaction ID, etc."
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Create Transaction'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

