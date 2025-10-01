import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft as BackIcon,
  Printer as PrintIcon,
  Download as DownloadIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute } from '@/routes/accounts';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  sub_type: string | null;
  parent_id: number | null;
  opening_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TrialBalanceItem {
  account: Account;
  debit: number;
  credit: number;
}

interface TrialBalanceProps {
  trialBalance: TrialBalanceItem[];
}

export default function TrialBalance({ trialBalance }: TrialBalanceProps) {
  const handleBack = () => {
    router.visit(indexRoute.url());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export trial balance');
  };

  // Calculate totals
  const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);

  // Group by account type
  const groupedByType = trialBalance.reduce((groups, item) => {
    const type = item.account.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, TrialBalanceItem[]>);

  const isBalanced = totalDebit === totalCredit;

  return (
    <Layout title="Trial Balance - View account balances and financial summary">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trial Balance</h1>
            <p className="text-muted-foreground">
              Financial report showing account balances
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Accounts
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <PrintIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary">Total Debit</h3>
                <p className="text-3xl font-bold text-primary">${totalDebit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary-foreground">Total Credit</h3>
                <p className="text-3xl font-bold text-secondary-foreground">${totalCredit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trial Balance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trial Balance Report</CardTitle>
            <p className="text-sm text-muted-foreground">
              As of {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedByType).map(([type, items]) => (
                    <React.Fragment key={type}>
                      {/* Type Header */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={5}>
                          <h4 className="font-semibold text-sm">
                            {type.charAt(0).toUpperCase() + type.slice(1)} Accounts
                          </h4>
                        </TableCell>
                      </TableRow>
                      
                      {/* Accounts in this type */}
                      {items.map((item) => (
                        <TableRow key={item.account.id}>
                          <TableCell className="font-medium">{item.account.code}</TableCell>
                          <TableCell>{item.account.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.account.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.debit > 0 ? `$${item.debit.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.credit > 0 ? `$${item.credit.toFixed(2)}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Total Row */}
                  <TableRow className="bg-primary text-primary-foreground font-bold">
                    <TableCell colSpan={3}>
                      <span className="text-lg">TOTAL</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-lg">${totalDebit.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-lg">${totalCredit.toFixed(2)}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Balance Check */}
            <div className="mt-4">
              {isBalanced ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Trial Balance is Balanced</strong> - All debits equal credits
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Trial Balance is NOT Balanced</strong>
                    <br />
                    Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}