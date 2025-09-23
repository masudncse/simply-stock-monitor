import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import {
    Edit as EditIcon,
    ArrowBack as BackIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
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
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button
                        component={Link}
                        href="/roles"
                        startIcon={<BackIcon />}
                        variant="outlined"
                    >
                        Back to Roles
                    </Button>
                    <Typography variant="h4" component="h1">
                        Role Details
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <SecurityIcon color="primary" />
                                    <Box>
                                        <Typography variant="h5" component="h2">
                                            {role.name}
                                        </Typography>
                                        <Chip
                                            label={role.name}
                                            color={getRoleColor(role.name)}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Created
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(role.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(role.updated_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Permissions
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {role.permissions.length}
                                    </Typography>
                                </Box>

                                <Button
                                    component={Link}
                                    href={`/roles/${role.id}/edit`}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<EditIcon />}
                                >
                                    Edit Role
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Permissions ({role.permissions.length})
                                </Typography>

                                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                    <Box key={category} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1, textTransform: 'capitalize' }}>
                                            {category} ({categoryPermissions.length})
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {categoryPermissions.map((permission) => (
                                                <Chip
                                                    key={permission.id}
                                                    label={permission.name.replace(`${category}-`, '').replace('-', ' ')}
                                                    color={getPermissionColor(permission.name)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </Stack>
                                        <Divider sx={{ mt: 2 }} />
                                    </Box>
                                ))}

                                {role.permissions.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No permissions assigned
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            This role doesn't have any permissions yet
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}
