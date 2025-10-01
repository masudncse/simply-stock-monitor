import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Edit,
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

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

interface UsersShowProps {
    user: User;
}

export default function UsersShow({ user }: UsersShowProps) {
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
        <Layout title={`User: ${user.name} - View user profile and activity`}>
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        asChild
                        variant="outline"
                    >
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">
                        User Details
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center mb-6">
                                <Avatar className="h-20 w-20 mb-4">
                                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold text-center mb-2">{user.name}</h2>
                                <Badge variant={user.email_verified_at ? "default" : "secondary"} className="text-xs">
                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                </Badge>
                            </div>

                            <div className="border-t pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Member Since</p>
                                            <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Last Updated</p>
                                            <p className="font-medium">{new Date(user.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                asChild
                                className="w-full mt-6"
                            >
                                <Link href={`/users/${user.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <CardTitle>Roles & Permissions</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {user.roles.length > 0 ? (
                                    <div>
                                        <h4 className="text-lg font-medium mb-4">
                                            Assigned Roles ({user.roles.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {user.roles.map((role) => (
                                                <Badge key={role.id} variant="default" className="text-sm">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="border-t pt-6">
                                            <h4 className="text-lg font-medium mb-4">Role Information</h4>
                                            <div className="p-4 border rounded-lg bg-muted/50">
                                                <p className="text-sm text-muted-foreground">
                                                    This user has been assigned {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}. 
                                                    Each role comes with specific permissions that determine what actions the user can perform in the system.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                            No roles assigned
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            This user doesn't have any roles assigned yet
                                        </p>
                                        <Button
                                            asChild
                                            variant="outline"
                                        >
                                            <Link href={`/users/${user.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Assign Roles
                                            </Link>
                                        </Button>
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
