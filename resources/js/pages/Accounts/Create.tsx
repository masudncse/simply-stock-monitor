import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save as SaveIcon, ArrowLeft as BackIcon } from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { store as storeRoute, index as indexRoute } from '@/routes/accounts';

interface ParentAccount {
  id: number;
  code: string;
  name: string;
}

interface AccountsCreateProps {
  parentAccounts: ParentAccount[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
    {
        title: 'Create Account',
        href: '#',
    },
];

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

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert "none" back to empty string for parent_id
    const submitData = {
      ...formData,
      parent_id: formData.parent_id === 'none' ? '' : formData.parent_id
    };
    
    router.post(storeRoute.url(), submitData, {
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
    <Layout title="Create Account" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground">
              Add a new account to your chart of accounts
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Account Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className={errors.code ? 'border-destructive' : ''}
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub_type">Sub Type</Label>
                  <Input
                    id="sub_type"
                    value={formData.sub_type}
                    onChange={(e) => handleChange('sub_type', e.target.value)}
                    className={errors.sub_type ? 'border-destructive' : ''}
                  />
                  {errors.sub_type && (
                    <p className="text-sm text-destructive">{errors.sub_type}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active" className="text-sm font-normal">
                      Active
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Account</Label>
                  <Select value={formData.parent_id} onValueChange={(value) => handleChange('parent_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="No Parent Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent Account</SelectItem>
                      {parentAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opening_balance">Opening Balance</Label>
                  <Input
                    id="opening_balance"
                    type="number"
                    value={formData.opening_balance}
                    onChange={(e) => handleChange('opening_balance', parseFloat(e.target.value) || 0)}
                    className={errors.opening_balance ? 'border-destructive' : ''}
                  />
                  {errors.opening_balance && (
                    <p className="text-sm text-destructive">{errors.opening_balance}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
              Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}