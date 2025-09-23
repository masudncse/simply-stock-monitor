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
import { Save as SaveIcon, ArrowBack as BackIcon, Security as SecurityIcon } from '@mui/icons-material';
import { Link, useForm } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

interface Role {
    id: number;
    name: string;
}

interface PermissionsCreateProps {
    roles: Role[];
}

export default function PermissionsCreate({ roles }: PermissionsCreateProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'web',
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
        post('/permissions');
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
        <Layout title="Create New Permission">
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
                        Create New Permission
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <SecurityIcon color="primary" />
                                        <Typography variant="h6">
                                            Permission Information
                                        </Typography>
                                    </Box>
                                    
                                    <TextField
                                        fullWidth
                                        label="Permission Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name || 'e.g., view-products, create-users, edit-roles'}
                                        margin="normal"
                                        required
                                        placeholder="view-products"
                                    />

                                    <TextField
                                        fullWidth
                                        label="Guard Name"
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        error={!!errors.guard_name}
                                        helperText={errors.guard_name || 'Usually "web" for web applications'}
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
                                        {processing ? 'Creating...' : 'Create Permission'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Assign to Roles
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
