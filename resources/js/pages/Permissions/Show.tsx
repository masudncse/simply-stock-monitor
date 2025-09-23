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
    Paper,
} from '@mui/material';
import {
    Edit as EditIcon,
    ArrowBack as BackIcon,
    Security as SecurityIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

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

interface PermissionsShowProps {
    permission: Permission;
}

export default function PermissionsShow({ permission }: PermissionsShowProps) {
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
            case 'assign':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getCategoryFromName = (name: string) => {
        return name.split('-')[0];
    };

    return (
        <Layout title={`Permission: ${permission.name}`}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button
                        component={Link}
                        href="/permissions"
                        startIcon={<BackIcon />}
                        variant="outlined"
                    >
                        Back to Permissions
                    </Button>
                    <Typography variant="h4" component="h1">
                        Permission Details
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
                                            {permission.name}
                                        </Typography>
                                        <Chip
                                            label={getCategoryFromName(permission.name)}
                                            color={getPermissionColor(permission.name)}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <ShieldIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Guard Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {permission.guard_name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <SecurityIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Created
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(permission.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <SecurityIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(permission.updated_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>

                                <Button
                                    component={Link}
                                    href={`/permissions/${permission.id}/edit`}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<EditIcon />}
                                    sx={{ mt: 3 }}
                                >
                                    Edit Permission
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <SecurityIcon color="primary" />
                                    <Typography variant="h6">
                                        Assigned Roles
                                    </Typography>
                                </Box>

                                {permission.roles.length > 0 ? (
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Roles with this Permission ({permission.roles.length})
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                            {permission.roles.map((role) => (
                                                <Chip
                                                    key={role.id}
                                                    label={role.name}
                                                    color={getRoleColor(role.name)}
                                                    variant="filled"
                                                    size="medium"
                                                />
                                            ))}
                                        </Stack>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="subtitle1" gutterBottom>
                                            Permission Information
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                This permission "{permission.name}" is assigned to {permission.roles.length} role{permission.roles.length !== 1 ? 's' : ''}. 
                                                Users with these roles will have access to the functionality controlled by this permission.
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <SecurityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            No roles assigned
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            This permission is not assigned to any roles yet
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={`/permissions/${permission.id}/edit`}
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            sx={{ mt: 2 }}
                                        >
                                            Assign to Roles
                                        </Button>
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
