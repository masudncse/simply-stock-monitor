import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Plus, Shield as ShieldIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

export default function SettingsRoles() {
    return (
        <Layout title="Roles & Permissions">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Roles & Permissions
                </h1>
                
                <p className="text-muted-foreground mb-8">
                    Define roles and assign permissions to control user access throughout the system.
                </p>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Role Management</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Create and manage roles with specific permissions. Roles help organize users and control what they can access in the system.
                        </p>

                        <div className="space-y-2 mb-6">
                            <Link href="/roles" className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                                <Shield className="mr-3 h-4 w-4" />
                                <div>
                                    <div className="font-medium">View All Roles</div>
                                    <div className="text-sm text-muted-foreground">Browse and manage all system roles</div>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button asChild className="w-full">
                                    <Link href="/roles">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Manage Roles
                                    </Link>
                                </Button>
                                
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/roles/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Role
                                    </Link>
                                </Button>
                                
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/permissions">
                                        <ShieldIcon className="mr-2 h-4 w-4" />
                                        Manage Permissions
                                    </Link>
                                </Button>
                                
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/permissions/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Permission
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Available Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            The system includes the following permission categories:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Products</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-products, create-products, edit-products, delete-products
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Stock</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-stock, adjust-stock, transfer-stock
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Sales</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-sales, create-sales, edit-sales, delete-sales, process-sales
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Purchases</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-purchases, create-purchases, edit-purchases, delete-purchases, approve-purchases
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Customers</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-customers, create-customers, edit-customers, delete-customers
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Reports</h4>
                                <p className="text-sm text-muted-foreground">
                                    view-reports, export-reports
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
