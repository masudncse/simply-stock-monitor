import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users as UsersIcon,
  Save as SaveIcon,
  ArrowLeft as BackIcon,
  AlertTriangle as WarningIcon,
} from 'lucide-react';
import Layout from '../../../layouts/Layout';

interface Role {
  id: number;
  name: string;
}

interface CreateUserProps {
  roles: Role[];
}

const CreateUser: React.FC<CreateUserProps> = ({ roles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked
        ? [...prev.roles, roleId]
        : prev.roles.filter(id => id !== roleId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/settings/users', formData, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <Layout title="Create User">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter password"
                    minLength={8}
                  />
                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password *</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => handleChange('password_confirmation', e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {roles.length === 0 ? (
                <Alert>
                  <WarningIcon className="h-4 w-4" />
                  <AlertDescription>
                    No roles available. Create roles first to assign permissions to users.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select the roles to assign to this user. Roles determine what permissions the user has.
                  </p>
                  <div className="grid gap-3">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={formData.roles.includes(role.id)}
                          onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                        />
                        <Label htmlFor={`role-${role.id}`} className="text-sm font-medium">
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" asChild>
                  <InertiaLink href="/settings/users">
                    <BackIcon className="mr-2 h-4 w-4" />
                    Cancel
                  </InertiaLink>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default CreateUser;
