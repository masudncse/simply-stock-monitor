import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Stack,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { Link, router } from '@inertiajs/react';
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

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
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

export default function PermissionsIndex({ permissions }: PermissionsIndexProps) {
    const handleDelete = (permission: Permission) => {
        if (window.confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
            router.delete(`/permissions/${permission.id}`);
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
        <Layout title="Permissions Management">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Permissions Management
                    </Typography>
                    <Button
                        component={Link}
                        href="/permissions/create"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Create Permission
                    </Button>
                </Box>

                <Card>
                    <CardContent>
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Permission</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Guard</TableCell>
                                        <TableCell>Assigned Roles</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {permissions.data.map((permission) => (
                                        <TableRow key={permission.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SecurityIcon color="action" fontSize="small" />
                                                    <Typography variant="subtitle2" fontWeight="medium">
                                                        {permission.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getCategoryFromName(permission.name)}
                                                    size="small"
                                                    color={getPermissionColor(permission.name)}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={permission.guard_name}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    {permission.roles.slice(0, 2).map((role) => (
                                                        <Chip
                                                            key={role.id}
                                                            label={role.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem', height: 20 }}
                                                        />
                                                    ))}
                                                    {permission.roles.length > 2 && (
                                                        <Chip
                                                            label={`+${permission.roles.length - 2} more`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem', height: 20 }}
                                                        />
                                                    )}
                                                    {permission.roles.length === 0 && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            No roles
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(permission.created_at).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <IconButton
                                                        component={Link}
                                                        href={`/permissions/${permission.id}`}
                                                        size="small"
                                                        color="info"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        component={Link}
                                                        href={`/permissions/${permission.id}/edit`}
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(permission)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {permissions.data.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <SecurityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No permissions found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Create your first permission to get started
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
