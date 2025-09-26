import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Plus,
    Edit,
    Eye,
    Trash2,
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';
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

interface RolesIndexProps {
    roles: {
        data: Role[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export default function RolesIndex({ roles }: RolesIndexProps) {
    const handleDelete = (role: Role) => {
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(`/roles/${role.id}`);
        }
    };

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

    return (
        <Layout title="Roles Management">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Roles Management
                    </h1>
                    <Button
                        asChild
                    >
                        <Link href="/roles/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{role.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {role.name}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.slice(0, 3).map((permission) => (
                                                    <Badge key={permission.id} variant="outline" className="text-xs">
                                                        {permission.name}
                                                    </Badge>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{role.permissions.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(role.created_at).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link href={`/roles/${role.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link href={`/roles/${role.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(role)}
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={role.name === 'Admin'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {roles.data.length === 0 && (
                            <div className="text-center py-8">
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    No roles found
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create your first role to get started
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
