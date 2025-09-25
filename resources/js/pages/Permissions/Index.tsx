import React from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus as AddIcon,
  Edit as EditIcon,
  Eye as ViewIcon,
  Trash as DeleteIcon,
  Shield as SecurityIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';
import { cn } from '@/lib/utils';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export default function PermissionsIndex({ permissions }: PermissionsIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [permissionToDelete, setPermissionToDelete] = React.useState<Permission | null>(null);

    const handleDelete = (permission: Permission) => {
        setPermissionToDelete(permission);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (permissionToDelete) {
            router.delete(`/permissions/${permissionToDelete.id}`);
        }
        setDeleteDialogOpen(false);
        setPermissionToDelete(null);
    };

    const getPermissionVariant = (permissionName: string) => {
        const action = permissionName.split('-')[0];
        switch (action) {
            case 'view':
                return 'secondary';
            case 'create':
                return 'success';
            case 'edit':
                return 'default';
            case 'delete':
                return 'destructive';
            case 'assign':
                return 'primary';
            default:
                return 'outline';
        }
    };

    const getCategoryFromName = (name: string) => {
        return name.split('-')[0];
    };

    return (
        <Layout title="Permissions Management">
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Permissions Management</h1>
                        <p className="text-muted-foreground">
                            Manage system permissions and access control
                        </p>
                    </div>
                    <Button asChild>
                        <InertiaLink href="/permissions/create">
                            <AddIcon className="mr-2 h-4 w-4" />
                            Create Permission
                        </InertiaLink>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Permissions List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {permissions.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Permission</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Guard</TableHead>
                                            <TableHead>Assigned Roles</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.data.map((permission) => (
                                            <TableRow key={permission.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <SecurityIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{permission.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getPermissionVariant(permission.name)}>
                                                        {getCategoryFromName(permission.name)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {permission.guard_name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {permission.roles.slice(0, 2).map((role) => (
                                                            <Badge key={role.id} variant="outline" className="text-xs">
                                                                {role.name}
                                                            </Badge>
                                                        ))}
                                                        {permission.roles.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{permission.roles.length - 2} more
                                                            </Badge>
                                                        )}
                                                        {permission.roles.length === 0 && (
                                                            <span className="text-sm text-muted-foreground">No roles</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(permission.created_at).toLocaleDateString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <InertiaLink href={`/permissions/${permission.id}`}>
                                                                <ViewIcon className="h-4 w-4" />
                                                            </InertiaLink>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <InertiaLink href={`/permissions/${permission.id}/edit`}>
                                                                <EditIcon className="h-4 w-4" />
                                                            </InertiaLink>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive"
                                                            onClick={() => handleDelete(permission)}
                                                        >
                                                            <DeleteIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <SecurityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    No permissions found
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create your first permission to get started
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the permission <span className="font-semibold">{permissionToDelete?.name}</span>?
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
}
