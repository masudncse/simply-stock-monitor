import React, { useState } from 'react';
import { Link as InertiaLink, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Save as SaveIcon,
  ArrowLeft as BackIcon,
  Shield as SecurityIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    roles: Role[];
}

interface Role {
    id: number;
    name: string;
}

interface PermissionsEditProps {
    permission: Permission;
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
    {
        title: 'Edit Permission',
        href: '#',
    },
];

export default function PermissionsEdit({ permission, roles }: PermissionsEditProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        permission.roles.map(r => r.name)
    );

    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
        roles: selectedRoles,
    });

    const handleRoleChange = (roleName: string, checked: boolean) => {
        let newRoles;
        if (checked) {
            newRoles = [...selectedRoles, roleName];
        } else {
            newRoles = selectedRoles.filter(r => r !== roleName);
        }
        setSelectedRoles(newRoles);
        setData('roles', newRoles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/permissions/${permission.id}`);
    };

    const getRoleVariant = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return 'destructive';
            case 'sales':
                return 'default';
            case 'storekeeper':
                return 'secondary';
            case 'accountant':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <Layout title={`Edit Permission: ${permission.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Permission: {permission.name}</h1>
                        <p className="text-muted-foreground">
                            Update permission details and role assignments
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Permission Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <SecurityIcon className="h-5 w-5 text-primary" />
                                    Permission Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Permission Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guard_name">Guard Name *</Label>
                                    <Input
                                        id="guard_name"
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                    />
                                    {errors.guard_name && <p className="text-sm text-destructive">{errors.guard_name}</p>}
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm text-muted-foreground">
                                        Selected Roles: {selectedRoles.length}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <SaveIcon className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Assign to Roles */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assign to Roles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {errors.roles && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.roles}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">Available Roles ({roles.length})</Label>
                                    </div>
                                    <Separator />
                                    
                                    <div className="space-y-3">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={selectedRoles.includes(role.name)}
                                                    onCheckedChange={(checked) => handleRoleChange(role.name, !!checked)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={`role-${role.id}`} className="text-sm font-medium">
                                                        {role.name}
                                                    </Label>
                                                    <Badge variant={getRoleVariant(role.name)}>
                                                        {role.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedRoles.length > 0 && (
                                    <div className="pt-4">
                                        <Label className="text-sm font-medium">Selected Roles:</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedRoles.map((roleName) => (
                                                <Badge key={roleName} variant={getRoleVariant(roleName)}>
                                                    {roleName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
