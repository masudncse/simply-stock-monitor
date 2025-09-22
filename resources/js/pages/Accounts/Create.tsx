import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface ParentAccount {
  id: number;
  code: string;
  name: string;
}

interface AccountsCreateProps {
  parentAccounts: ParentAccount[];
}

export default function AccountsCreate({ parentAccounts }: AccountsCreateProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    sub_type: '',
    parent_id: '',
    opening_balance: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.post(route('accounts.store'), formData, {
      onError: (errors) => {
        setErrors(errors);
      },
    });
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
            Create Account
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.visit(route('accounts.index'))}
          >
            Back to Accounts
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Account Code"
                        value={formData.code}
                        onChange={handleChange('code')}
                        error={!!errors.code}
                        helperText={errors.code}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Account Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Account Type</InputLabel>
                        <Select
                          value={formData.type}
                          label="Account Type"
                          onChange={handleSelectChange('type')}
                        >
                          {accountTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Sub Type"
                        value={formData.sub_type}
                        onChange={handleChange('sub_type')}
                        error={!!errors.sub_type}
                        helperText={errors.sub_type}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_active}
                            onChange={handleChange('is_active')}
                          />
                        }
                        label="Active"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Parent Account</InputLabel>
                        <Select
                          value={formData.parent_id}
                          label="Parent Account"
                          onChange={handleSelectChange('parent_id')}
                        >
                          <MenuItem value="">No Parent Account</MenuItem>
                          {parentAccounts.map((account) => (
                            <MenuItem key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Opening Balance"
                        type="number"
                        value={formData.opening_balance}
                        onChange={handleChange('opening_balance')}
                        error={!!errors.opening_balance}
                        helperText={errors.opening_balance}
                        inputProps={{ step: 0.01 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.visit(route('accounts.index'))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Create Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}
