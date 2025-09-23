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
    Avatar,
    Paper,
} from '@mui/material';
import {
    Edit as EditIcon,
    ArrowBack as BackIcon,
    Email as EmailIcon,
    Security as SecurityIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
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
        <Layout title={`User: ${user.name}`}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button
                        component={Link}
                        href="/users"
                        startIcon={<BackIcon />}
                        variant="outlined"
                    >
                        Back to Users
                    </Button>
                    <Typography variant="h4" component="h1">
                        User Details
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                                        {getInitials(user.name)}
                                    </Avatar>
                                    <Typography variant="h5" component="h2" textAlign="center">
                                        {user.name}
                                    </Typography>
                                    <Chip
                                        label={user.email_verified_at ? 'Verified' : 'Unverified'}
                                        color={user.email_verified_at ? 'success' : 'warning'}
                                        variant="outlined"
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <EmailIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CalendarIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Member Since
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CalendarIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(user.updated_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>

                                <Button
                                    component={Link}
                                    href={`/users/${user.id}/edit`}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<EditIcon />}
                                    sx={{ mt: 3 }}
                                >
                                    Edit User
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
                                        Roles & Permissions
                                    </Typography>
                                </Box>

                                {user.roles.length > 0 ? (
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Assigned Roles ({user.roles.length})
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                            {user.roles.map((role) => (
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
                                            Role Information
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                This user has been assigned {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}. 
                                                Each role comes with specific permissions that determine what actions the user can perform in the system.
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
                                            This user doesn't have any roles assigned yet
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={`/users/${user.id}/edit`}
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            sx={{ mt: 2 }}
                                        >
                                            Assign Roles
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
