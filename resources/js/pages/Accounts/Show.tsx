import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute, edit as editRoute } from '@/routes/accounts';

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

export default function AccountsShow({ account, balance }: AccountsShowProps) {
  const handleEdit = () => {
    router.visit(editRoute.url({ account: account.id }));
  };

  const handleBack = () => {
    router.visit(indexRoute.url());
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Account Details
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
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Account
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Account Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">
                      {account.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {account.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Type
                    </Typography>
                    <Typography variant="body1">
                      {account.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Sub Type
                    </Typography>
                    <Typography variant="body1">
                      {account.sub_type || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Parent Account
                    </Typography>
                    <Typography variant="body1">
                      {account.parent ? `${account.parent.code} - ${account.parent.name}` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={account.is_active ? 'Active' : 'Inactive'}
                      color={account.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Opening Balance
                    </Typography>
                    <Typography variant="h6" color={account.opening_balance >= 0 ? 'success.main' : 'error.main'}>
                      ${account.opening_balance.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Current Balance
                    </Typography>
                    <Typography variant="h5" color={balance >= 0 ? 'success.main' : 'error.main'}>
                      ${balance.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Child Accounts */}
          {account.children && account.children.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Child Accounts
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {account.children.map((child) => (
                          <TableRow key={child.id}>
                            <TableCell>{child.code}</TableCell>
                            <TableCell>{child.name}</TableCell>
                            <TableCell>{child.type}</TableCell>
                            <TableCell>
                              <Chip
                                label={child.is_active ? 'Active' : 'Inactive'}
                                color={child.is_active ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Transactions */}
          {account.transactions && account.transactions.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Transactions
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Reference</TableCell>
                          <TableCell align="right">Debit</TableCell>
                          <TableCell align="right">Credit</TableCell>
                        </TableRow>
                      </TableHead>
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
                            <TableCell align="right">
                              {transaction.debit > 0 ? `$${transaction.debit.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {transaction.credit > 0 ? `$${transaction.credit.toFixed(2)}` : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  );
}
