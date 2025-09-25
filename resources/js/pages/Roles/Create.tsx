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
  Shield as ShieldIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface Permission {
    id: number;
    name: string;
}

interface RolesCreateProps {
    permissions: Record<string, Permission[]>;
}

export default function RolesCreate({ permissions }: RolesCreateProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: selectedPermissions,
    });

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        let newPermissions;
        if (checked) {
            newPermissions = [...selectedPermissions, permissionName];
        } else {
            newPermissions = selectedPermissions.filter(p => p !== permissionName);
        }
        setSelectedPermissions(newPermissions);
        setData('permissions', newPermissions);
    };

    const handleSelectAll = (category: string, checked: boolean) => {
        const categoryPermissions = permissions[category] || [];
        let newPermissions = [...selectedPermissions];
        
        if (checked) {
            // Add all permissions from this category
            categoryPermissions.forEach(permission => {
                if (!newPermissions.includes(permission.name)) {
                    newPermissions.push(permission.name);
                }
            });
        } else {
            // Remove all permissions from this category
            newPermissions = newPermissions.filter(
                permission => !categoryPermissions.some(p => p.name === permission)
            );
        }
        
        setSelectedPermissions(newPermissions);
        setData('permissions', newPermissions);
    };

    const isCategorySelected = (category: string) => {
        const categoryPermissions = permissions[category] || [];
        return categoryPermissions.every(permission => 
            selectedPermissions.includes(permission.name)
        );
    };

    const isCategoryIndeterminate = (category: string) => {
        const categoryPermissions = permissions[category] || [];
        const selectedCount = categoryPermissions.filter(permission => 
            selectedPermissions.includes(permission.name)
        ).length;
        return selectedCount > 0 && selectedCount < categoryPermissions.length;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <Layout title="Create New Role">
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" asChild>
                        <InertiaLink href="/roles">
                            <BackIcon className="mr-2 h-4 w-4" />
                            Back to Roles
                        </InertiaLink>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
                        <p className="text-muted-foreground">
                            Define a new role and assign permissions
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Role Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldIcon className="h-5 w-5 text-primary" />
                                    Role Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Manager, Editor, Viewer"
                                        required
                                        isInvalid={!!errors.name}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm text-muted-foreground">
                                        Selected Permissions: {selectedPermissions.length}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <SaveIcon className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Role'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Permissions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {errors.permissions && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.permissions}</AlertDescription>
                                    </Alert>
                                )}

                                {Object.entries(permissions).map(([category, categoryPermissions]) => (
                                    <div key={category} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-base capitalize">{category}</Label>
                                                <Badge variant="outline" className="text-xs">
                                                    {categoryPermissions.length} permissions
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`select-all-${category}`}
                                                checked={isCategorySelected(category)}
                                                onCheckedChange={(checked) => handleSelectAll(category, !!checked)}
                                            />
                                            <Label htmlFor={`select-all-${category}`} className="text-sm font-medium">
                                                Select All {category} permissions
                                            </Label>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            {categoryPermissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={selectedPermissions.includes(permission.name)}
                                                        onCheckedChange={(checked) => handlePermissionChange(permission.name, !!checked)}
                                                    />
                                                    <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                                        {permission.name.replace(`${category}-`, '').replace('-', ' ')}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
