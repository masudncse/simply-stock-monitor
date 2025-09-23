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
} from '@mui/icons-material';
import { Link, router } from '@inertiajs/react';
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

interface RolesIndexProps {
    roles: {
        data: Role[];
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

export default function RolesIndex({ roles }: RolesIndexProps) {
    const handleDelete = (role: Role) => {
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(`/roles/${role.id}`);
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

    return (
        <Layout title="Roles Management">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Roles Management
                    </Typography>
                    <Button
                        component={Link}
                        href="/roles/create"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Create Role
                    </Button>
                </Box>

                <Card>
                    <CardContent>
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Permissions</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow key={role.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="medium">
                                                        {role.name}
                                                    </Typography>
                                                    <Chip
                                                        label={role.name}
                                                        size="small"
                                                        color={getRoleColor(role.name)}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    {role.permissions.slice(0, 3).map((permission) => (
                                                        <Chip
                                                            key={permission.id}
                                                            label={permission.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem', height: 20 }}
                                                        />
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Chip
                                                            label={`+${role.permissions.length - 3} more`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.75rem', height: 20 }}
                                                        />
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(role.created_at).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <IconButton
                                                        component={Link}
                                                        href={`/roles/${role.id}`}
                                                        size="small"
                                                        color="info"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        component={Link}
                                                        href={`/roles/${role.id}/edit`}
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(role)}
                                                        size="small"
                                                        color="error"
                                                        disabled={role.name === 'Admin'}
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

                        {roles.data.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No roles found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Create your first role to get started
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
