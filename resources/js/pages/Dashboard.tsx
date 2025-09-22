import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Layout from '../layouts/Layout';

interface DashboardProps {
  stats: {
    totalProducts: number;
    totalStock: number;
    totalSales: number;
    totalCustomers: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Stock Value',
      value: `$${stats.totalStock.toLocaleString()}`,
      icon: <StoreIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Layout title="Dashboard">
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ color: card.color }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome to the Stock Management System. Use the navigation menu to access different modules.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}