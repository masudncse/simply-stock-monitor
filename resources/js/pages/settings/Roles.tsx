import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Security as SecurityIcon,
    Add as AddIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

export default function SettingsRoles() {
    return (
        <Layout title="Roles & Permissions">
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Roles & Permissions
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Define roles and assign permissions to control user access throughout the system.
                </Typography>

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <SecurityIcon color="primary" />
                            <Typography variant="h6">
                                Role Management
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Create and manage roles with specific permissions. Roles help organize users and control what they can access in the system.
                        </Typography>

                        <List>
                            <ListItem component={Link} href="/roles" sx={{ cursor: 'pointer' }}>
                                <ListItemIcon>
                                    <SecurityIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="View All Roles" 
                                    secondary="Browse and manage all system roles"
                                />
                            </ListItem>
                            
                            <ListItem component={Link} href="/roles/create" sx={{ cursor: 'pointer' }}>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Create New Role" 
                                    secondary="Define a new role with specific permissions"
                                />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/roles"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<SecurityIcon />}
                                >
                                    Manage Roles
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/roles/create"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                >
                                    Create Role
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/permissions"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<ShieldIcon />}
                                >
                                    Manage Permissions
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/permissions/create"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                >
                                    Create Permission
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Available Permissions
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The system includes the following permission categories:
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Products
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-products, create-products, edit-products, delete-products
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Stock
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-stock, adjust-stock, transfer-stock
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Sales
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-sales, create-sales, edit-sales, delete-sales, process-sales
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Purchases
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-purchases, create-purchases, edit-purchases, delete-purchases, approve-purchases
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Customers
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-customers, create-customers, edit-customers, delete-customers
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Reports
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    view-reports, export-reports
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
