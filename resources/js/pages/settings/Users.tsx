import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

export default function SettingsUsers() {
    return (
        <Layout title="User Management">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    User Management
                </h1>
                
                <p className="text-muted-foreground mb-8">
                    Manage users, roles, and permissions for your system.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <CardTitle>Users</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Manage system users, their accounts, and basic information.
                            </p>

                            <div className="space-y-2 mb-6">
                                <Link href="/users" className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Users className="mr-3 h-4 w-4" />
                                    <div>
                                        <div className="font-medium">View All Users</div>
                                        <div className="text-sm text-muted-foreground">Browse and manage all system users</div>
                                    </div>
                                </Link>
                                
                                <Link href="/users/create" className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Plus className="mr-3 h-4 w-4" />
                                    <div>
                                        <div className="font-medium">Create New User</div>
                                        <div className="text-sm text-muted-foreground">Add a new user to the system</div>
                                    </div>
                                </Link>
                            </div>

                            <div className="border-t pt-6">
                                <Button asChild className="w-full">
                                    <Link href="/users">
                                        <Users className="mr-2 h-4 w-4" />
                                        Manage Users
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Roles & Permissions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Define roles and assign permissions to control user access.
                            </p>

                            <div className="space-y-2 mb-6">
                                <Link href="/roles" className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Shield className="mr-3 h-4 w-4" />
                                    <div>
                                        <div className="font-medium">View All Roles</div>
                                        <div className="text-sm text-muted-foreground">Browse and manage system roles</div>
                                    </div>
                                </Link>
                                
                                <Link href="/roles/create" className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <Plus className="mr-3 h-4 w-4" />
                                    <div>
                                        <div className="font-medium">Create New Role</div>
                                        <div className="text-sm text-muted-foreground">Define a new role with specific permissions</div>
                                    </div>
                                </Link>
                            </div>

                            <div className="border-t pt-6">
                                <Button asChild className="w-full">
                                    <Link href="/roles">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Manage Roles
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/users/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/roles/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Role
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/users">
                                    <Users className="mr-2 h-4 w-4" />
                                    View Users
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/roles">
                                    <Shield className="mr-2 h-4 w-4" />
                                    View Roles
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
