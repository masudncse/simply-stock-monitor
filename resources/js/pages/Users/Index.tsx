import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus as AddIcon,
  Edit as EditIcon,
  Eye as ViewIcon,
  Trash as DeleteIcon,
  ArrowUpDown as SortIcon,
  ArrowUp as SortAscIcon,
  ArrowDown as SortDescIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
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
    filters: {
        search?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

    const handleSearch = () => {
        router.get('/users', {
            search: searchTerm,
            sort_by: sortBy,
            sort_direction: sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column: string) => {
        let newDirection = 'asc';
        
        if (sortBy === column) {
            // If clicking the same column, toggle direction
            newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }
        
        setSortBy(column);
        setSortDirection(newDirection);
        
        // Trigger search with new sort parameters
        router.get('/users', {
            search: searchTerm,
            sort_by: column,
            sort_direction: newDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <SortIcon className="h-4 w-4 text-muted-foreground" />;
        }
        return sortDirection === 'asc' 
            ? <SortAscIcon className="h-4 w-4 text-primary" />
            : <SortDescIcon className="h-4 w-4 text-primary" />;
    };

    const handleDelete = (user: User) => {
        if (window.confirm(`Are you sure you want to delete the user "${user.name}"?`)) {
            router.delete(`/users/${user.id}`);
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

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Layout title="Users Management">
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                        <p className="text-muted-foreground">Manage user accounts and roles</p>
                    </div>
                    <Button asChild>
                        <InertiaLink href="/users/create">
                            <AddIcon className="mr-2 h-4 w-4" />
                            Create User
                        </InertiaLink>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Users List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    User
                                                    {getSortIcon('name')}
                                                </div>
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Email
                                                    {getSortIcon('email')}
                                                </div>
                                            </Button>
                                        </TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Created
                                                    {getSortIcon('created_at')}
                                                </div>
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <div className="flex h-full w-full items-center justify-center text-xs font-medium">
                                                            {getInitials(user.name)}
                                                        </div>
                                                    </Avatar>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{user.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.id} variant="outline" className="text-xs">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {user.roles.length === 0 && (
                                                        <span className="text-sm text-muted-foreground">No roles</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.email_verified_at ? 'success' : 'secondary'}>
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <InertiaLink href={`/users/${user.id}`}>
                                                            <ViewIcon className="h-4 w-4" />
                                                        </InertiaLink>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <InertiaLink href={`/users/${user.id}/edit`}>
                                                            <EditIcon className="h-4 w-4" />
                                                        </InertiaLink>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(user)}
                                                        disabled={user.roles.some(role => role.name === 'Admin') && users.data.filter(u => u.roles.some(r => r.name === 'Admin')).length <= 1}
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

                        {users.data.length === 0 && (
                            <div className="text-center py-8">
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
                                <p className="text-sm text-muted-foreground">Create your first user to get started</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
