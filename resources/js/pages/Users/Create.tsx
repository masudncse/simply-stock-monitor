import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
    Typography,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { Link, useForm } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

interface Role {
    id: number;
    name: string;
}

interface UsersCreateProps {
    roles: Role[];
}

export default function UsersCreate({ roles }: UsersCreateProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
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
        post('/users');
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
        <Layout title="Create New User">
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
                        Create New User
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        User Information
                                    </Typography>
                                    
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        margin="normal"
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        margin="normal"
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        margin="normal"
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        error={!!errors.password_confirmation}
                                        helperText={errors.password_confirmation}
                                        margin="normal"
                                        required
                                    />

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Selected Roles: {selectedRoles.length}
                                        </Typography>
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        disabled={processing}
                                        sx={{ mt: 3 }}
                                    >
                                        {processing ? 'Creating...' : 'Create User'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Assign Roles
                                    </Typography>
                                    
                                    {errors.roles && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {errors.roles}
                                        </Alert>
                                    )}

                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel component="legend" sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1">
                                                Available Roles ({roles.length})
                                            </Typography>
                                        </FormLabel>
                                        
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <FormGroup>
                                            <Grid container spacing={1}>
                                                {roles.map((role) => (
                                                    <Grid item xs={12} key={role.id}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedRoles.includes(role.name)}
                                                                    onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                                                                />
                                                            }
                                                            label={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body1">
                                                                        {role.name}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={role.name}
                                                                        size="small"
                                                                        color={getRoleColor(role.name)}
                                                                        variant="outlined"
                                                                    />
                                                                </Box>
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </FormGroup>
                                    </FormControl>

                                    {selectedRoles.length > 0 && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Selected Roles:
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {selectedRoles.map((roleName) => (
                                                    <Chip
                                                        key={roleName}
                                                        label={roleName}
                                                        color={getRoleColor(roleName)}
                                                        variant="filled"
                                                        size="small"
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Layout>
    );
}
