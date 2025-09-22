import React from 'react';
import { Link as InertiaLink } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Tune as TuneIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

const SettingsIndex: React.FC = () => {
  const settingsCards = [
    {
      title: 'Company Settings',
      description: 'Configure company information, contact details, and branding',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      href: '/settings/company',
      color: '#1976d2',
    },
    {
      title: 'System Settings',
      description: 'Configure system behavior, defaults, and operational settings',
      icon: <TuneIcon sx={{ fontSize: 40 }} />,
      href: '/settings/system',
      color: '#388e3c',
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      href: '/settings/users',
      color: '#f57c00',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure user roles and access permissions',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      href: '/settings/roles',
      color: '#7b1fa2',
    },
    {
      title: 'Backup & Maintenance',
      description: 'Database backup, maintenance, and system health',
      icon: <BackupIcon sx={{ fontSize: 40 }} />,
      href: '/settings/backup',
      color: '#d32f2f',
    },
    {
      title: 'Appearance',
      description: 'Customize theme, colors, and display preferences',
      icon: <PaletteIcon sx={{ fontSize: 40 }} />,
      href: '/settings/appearance',
      color: '#5d4037',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your Stock Management System
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {settingsCards.map((setting, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        color: setting.color,
                        mr: 2,
                      }}
                    >
                      {setting.icon}
                    </Box>
                    <Typography variant="h6" component="h2">
                      {setting.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {setting.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={InertiaLink}
                    href={setting.href}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: setting.color,
                      '&:hover': {
                        backgroundColor: setting.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Configure
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              component={InertiaLink}
              href="/settings/company"
            >
              Company Info
            </Button>
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              component={InertiaLink}
              href="/settings/system"
            >
              System Config
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              component={InertiaLink}
              href="/settings/users"
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              startIcon={<BackupIcon />}
              component={InertiaLink}
              href="/settings/backup"
            >
              Backup Data
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Application Version
              </Typography>
              <Typography variant="body1">
                v1.0.0
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                PHP Version
              </Typography>
              <Typography variant="body1">
                {typeof window !== 'undefined' ? '8.3.21' : 'PHP 8.3+'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Laravel Version
              </Typography>
              <Typography variant="body1">
                12.x
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Database
              </Typography>
              <Typography variant="body1">
                MySQL
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SettingsIndex;
