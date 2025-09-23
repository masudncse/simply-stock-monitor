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
    permissions: Permission[];
}

interface Permission {
    id: number;
    name: string;
}

interface RolesEditProps {
    role: Role;
    permissions: Record<string, Permission[]>;
}

export default function RolesEdit({ role, permissions }: RolesEditProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        role.permissions.map(p => p.name)
    );

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
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
        put(`/roles/${role.id}`);
    };

    return (
        <Layout title={`Edit Role: ${role.name}`}>
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
                        Edit Role: {role.name}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Role Information
                                    </Typography>
                                    
                                    <TextField
                                        fullWidth
                                        label="Role Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        margin="normal"
                                        required
                                    />

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Selected Permissions: {selectedPermissions.length}
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
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Permissions
                                    </Typography>
                                    
                                    {errors.permissions && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {errors.permissions}
                                        </Alert>
                                    )}

                                    {Object.entries(permissions).map(([category, categoryPermissions]) => (
                                        <Box key={category} sx={{ mb: 3 }}>
                                            <FormControl component="fieldset" fullWidth>
                                                <FormLabel component="legend" sx={{ mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                                            {category}
                                                        </Typography>
                                                        <Chip 
                                                            label={`${categoryPermissions.length} permissions`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </FormLabel>
                                                
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={isCategorySelected(category)}
                                                            indeterminate={isCategoryIndeterminate(category)}
                                                            onChange={(e) => handleSelectAll(category, e.target.checked)}
                                                        />
                                                    }
                                                    label={`Select All ${category} permissions`}
                                                    sx={{ mb: 1, fontWeight: 'medium' }}
                                                />
                                                
                                                <Divider sx={{ mb: 1 }} />
                                                
                                                <FormGroup>
                                                    <Grid container spacing={1}>
                                                        {categoryPermissions.map((permission) => (
                                                            <Grid item xs={12} sm={6} md={4} key={permission.id}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selectedPermissions.includes(permission.name)}
                                                                            onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography variant="body2">
                                                                            {permission.name.replace(`${category}-`, '').replace('-', ' ')}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </FormGroup>
                                            </FormControl>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Layout>
    );
}
