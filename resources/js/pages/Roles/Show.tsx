import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    ArrowLeft,
    Shield,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface Permission {
    id: number;
    name: string;
}

interface RolesShowProps {
    role: Role;
}

export default function RolesShow({ role }: RolesShowProps) {
    const getRoleColor = (roleName: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'sales':
                return 'primary';
            case 'storekeeper':
                return 'info';
            case 'accountant':
                return 'success';
            default:
                return 'default';
        }
    };

    const getPermissionColor = (permissionName: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        const action = permissionName.split('-')[0];
        switch (action) {
            case 'view':
                return 'info';
            case 'create':
                return 'success';
            case 'edit':
                return 'warning';
            case 'delete':
                return 'error';
            default:
                return 'default';
        }
    };

    const groupPermissionsByCategory = () => {
        const grouped: Record<string, Permission[]> = {};
        role.permissions.forEach(permission => {
            const category = permission.name.split('-')[0];
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        return grouped;
    };

    const groupedPermissions = groupPermissionsByCategory();

    return (
        <Layout title={`Role: ${role.name}`}>
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        asChild
                        variant="outline"
                    >
                        <Link href="/roles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Roles
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">
                        Role Details
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="h-6 w-6 text-primary" />
                                <div>
                                    <h2 className="text-xl font-semibold">{role.name}</h2>
                                    <Badge variant="outline" className="text-xs">
                                        {role.name}
                                    </Badge>
                                </div>
                            </div>

                            <div className="border-t pt-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">{new Date(role.created_at).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">{new Date(role.updated_at).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Total Permissions</p>
                                    <p className="text-2xl font-bold text-primary">{role.permissions.length}</p>
                                </div>
                            </div>

                            <Button
                                asChild
                                className="w-full mt-6"
                            >
                                <Link href={`/roles/${role.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Role
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Permissions ({role.permissions.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                    <div key={category} className="mb-6">
                                        <h4 className="text-lg font-medium mb-3 capitalize">
                                            {category} ({categoryPermissions.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {categoryPermissions.map((permission) => (
                                                <Badge key={permission.id} variant="outline" className="text-xs">
                                                    {permission.name.replace(`${category}-`, '').replace('-', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="border-t" />
                                    </div>
                                ))}

                                {role.permissions.length === 0 && (
                                    <div className="text-center py-8">
                                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                            No permissions assigned
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This role doesn't have any permissions yet
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
