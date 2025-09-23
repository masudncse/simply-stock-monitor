import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as TrialBalanceIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

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
  };
}

export default function AccountsIndex({ accounts, filters }: AccountsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const [subTypeFilter, setSubTypeFilter] = useState(filters.sub_type || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleSearch = () => {
    router.get(route('accounts.index'), {
      search: searchTerm,
      type: typeFilter,
      sub_type: subTypeFilter,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      router.delete(route('accounts.destroy', accountToDelete.id));
    }
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'success';
      case 'liability':
        return 'error';
      case 'equity':
        return 'info';
      case 'income':
        return 'primary';
      case 'expense':
        return 'warning';
      default:
        return 'default';
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
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Chart of Accounts
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<TrialBalanceIcon />}
              onClick={() => router.visit(route('accounts.trial-balance'))}
            >
              Trial Balance
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.visit(route('accounts.create'))}
            >
              New Account
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Account Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {accountTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Sub Type"
                  value={subTypeFilter}
                  onChange={(e) => setSubTypeFilter(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  sx={{ height: '56px' }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Sub Type</TableCell>
                    <TableCell>Parent Account</TableCell>
                    <TableCell>Opening Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.data.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={account.type}
                          color={getTypeColor(account.type) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{account.sub_type || 'N/A'}</TableCell>
                      <TableCell>{account.parent_account?.name || 'N/A'}</TableCell>
                      <TableCell>${account.opening_balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={account.is_active ? 'Active' : 'Inactive'}
                          color={account.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(route('accounts.show', account.id))}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.visit(route('accounts.edit', account.id))}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(account)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {accounts.links && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {accounts.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
                  <Button
                    key={index}
                    variant={link.active ? 'contained' : 'outlined'}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={!link.url}
                    sx={{ mx: 0.5 }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete account {accountToDelete?.name}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
