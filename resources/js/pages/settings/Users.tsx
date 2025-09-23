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
    People as PeopleIcon,
    Security as SecurityIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

export default function SettingsUsers() {
    return (
        <Layout title="User Management">
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Management
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage users, roles, and permissions for your system.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <PeopleIcon color="primary" />
                                    <Typography variant="h6">
                                        Users
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Manage system users, their accounts, and basic information.
                                </Typography>

                                <List>
                                    <ListItem component={Link} href="/users" sx={{ cursor: 'pointer' }}>
                                        <ListItemIcon>
                                            <PeopleIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="View All Users" 
                                            secondary="Browse and manage all system users"
                                        />
                                    </ListItem>
                                    
                                    <ListItem component={Link} href="/users/create" sx={{ cursor: 'pointer' }}>
                                        <ListItemIcon>
                                            <AddIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Create New User" 
                                            secondary="Add a new user to the system"
                                        />
                                    </ListItem>
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Button
                                    component={Link}
                                    href="/users"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<PeopleIcon />}
                                >
                                    Manage Users
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <SecurityIcon color="primary" />
                                    <Typography variant="h6">
                                        Roles & Permissions
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Define roles and assign permissions to control user access.
                                </Typography>

                                <List>
                                    <ListItem component={Link} href="/roles" sx={{ cursor: 'pointer' }}>
                                        <ListItemIcon>
                                            <SecurityIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="View All Roles" 
                                            secondary="Browse and manage system roles"
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

                                <Button
                                    component={Link}
                                    href="/roles"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<SecurityIcon />}
                                >
                                    Manage Roles
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/users/create"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                >
                                    Add User
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
                                    Add Role
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/users"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PeopleIcon />}
                                >
                                    View Users
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    component={Link}
                                    href="/roles"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<SecurityIcon />}
                                >
                                    View Roles
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
