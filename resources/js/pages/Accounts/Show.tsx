import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Edit as EditIcon,
  ArrowLeft as BackIcon,
  FileText as LedgerIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { index as indexRoute, edit as editRoute, ledger as ledgerRoute } from '@/routes/accounts';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  sub_type: string | null;
  parent_id: number | null;
  opening_balance: number;
  is_active: boolean;
  parent?: Account | null;
  children?: Account[];
  transactions?: Transaction[];
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  transaction_date: string;
  reference_type: string;
  reference_id: number;
  debit: number;
  credit: number;
  description: string;
  created_at: string;
}

interface AccountsShowProps {
  account: Account;
  balance: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
    {
        title: 'Account Details',
        href: '#',
    },
];

export default function AccountsShow({ account, balance }: AccountsShowProps) {
  const handleEdit = () => {
    router.visit(editRoute.url({ account: account.id }));
  };

  const handleBack = () => {
    router.visit(indexRoute.url());
  };

  return (
    <Layout title="Account Details - View account information and transaction history" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Details</h1>
            <p className="text-muted-foreground">
              View account information and transaction history
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.visit(ledgerRoute.url({ account: account.id }))} className="bg-blue-600 hover:bg-blue-700">
              <LedgerIcon className="mr-2 h-4 w-4" />
              View Ledger
            </Button>
            <Button onClick={handleEdit}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Account
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{account.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{account.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p>{account.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sub Type</p>
                  <p>{account.sub_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Account</p>
                  <p>{account.parent ? `${account.parent.code} - ${account.parent.name}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={account.is_active ? 'default' : 'secondary'}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className={`text-lg font-semibold ${account.opening_balance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  ${account.opening_balance.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Child Accounts */}
          {account.children && account.children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Child Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {account.children.map((child) => (
                        <TableRow key={child.id}>
                          <TableCell className="font-medium">{child.code}</TableCell>
                          <TableCell>{child.name}</TableCell>
                          <TableCell>{child.type}</TableCell>
                          <TableCell>
                            <Badge variant={child.is_active ? 'default' : 'secondary'}>
                              {child.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Transactions */}
        {account.transactions && account.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {account.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {transaction.reference_type} #{transaction.reference_id}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.debit > 0 ? `$${transaction.debit.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.credit > 0 ? `$${transaction.credit.toFixed(2)}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}