import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
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

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Trial Balance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back to Accounts
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Total Debit
                </Typography>
                <Typography variant="h4" color="primary">
                  ${totalDebit.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Total Credit
                </Typography>
                <Typography variant="h4" color="secondary">
                  ${totalCredit.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Trial Balance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trial Balance Report
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              As of {new Date().toLocaleDateString()}
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account Code</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Credit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(groupedByType).map(([type, items]) => (
                    <React.Fragment key={type}>
                      {/* Type Header */}
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell colSpan={5}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {type.charAt(0).toUpperCase() + type.slice(1)} Accounts
                          </Typography>
                        </TableCell>
                      </TableRow>
                      
                      {/* Accounts in this type */}
                      {items.map((item) => (
                        <TableRow key={item.account.id}>
                          <TableCell>{item.account.code}</TableCell>
                          <TableCell>{item.account.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.account.type}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.debit > 0 ? `$${item.debit.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {item.credit > 0 ? `$${item.credit.toFixed(2)}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Total Row */}
                  <TableRow sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                    <TableCell colSpan={3}>
                      <Typography variant="h6" fontWeight="bold">
                        TOTAL
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight="bold">
                        ${totalDebit.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight="bold">
                        ${totalCredit.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Balance Check */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: totalDebit === totalCredit ? 'success.light' : 'error.light' }}>
              <Typography variant="body1" align="center">
                {totalDebit === totalCredit ? (
                  <Chip label="✓ Trial Balance is Balanced" color="success" />
                ) : (
                  <Chip label="✗ Trial Balance is NOT Balanced" color="error" />
                )}
              </Typography>
              {totalDebit !== totalCredit && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
