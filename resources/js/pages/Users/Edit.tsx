import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, ArrowLeft } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Role {
    id: number;
    name: string;
}

interface UsersEditProps {
    user: User;
    roles: Role[];
}

export default function UsersEdit({ user, roles }: UsersEditProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        user.roles.map(r => r.name)
    );

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
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
        put(`/users/${user.id}`);
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
        <Layout title={`Edit User: ${user.name}`}>
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
                        Edit User: {user.name}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="text-lg font-medium mb-4">User Information</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                                        </div>

                                        <div className="pt-4">
                                            <p className="text-sm text-muted-foreground">
                                                Selected Roles: {selectedRoles.length}
                                            </p>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assign Roles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {errors.roles && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.roles}</AlertDescription>
                                    </Alert>
                                )}

                                <div>
                                    <Label className="text-base font-medium">
                                        Available Roles ({roles.length})
                                    </Label>
                                    <div className="border-t mt-2 pt-4">
                                        <div className="space-y-3">
                                            {roles.map((role) => (
                                                <div key={role.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`role-${role.id}`}
                                                        checked={selectedRoles.includes(role.name)}
                                                        onCheckedChange={(checked) => handleRoleChange(role.name, checked as boolean)}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`role-${role.id}`} className="font-normal">
                                                            {role.name}
                                                        </Label>
                                                        <Badge variant="outline" className="text-xs">
                                                            {role.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {selectedRoles.length > 0 && (
                                    <div className="pt-4">
                                        <Label className="text-sm font-medium">Selected Roles:</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedRoles.map((roleName) => (
                                                <Badge key={roleName} variant="default" className="text-xs">
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
