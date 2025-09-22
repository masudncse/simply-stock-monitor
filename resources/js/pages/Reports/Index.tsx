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
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

const ReportsIndex: React.FC = () => {
  const reportCards = [
    {
      title: 'Stock Report',
      description: 'Current stock levels, low stock alerts, and stock valuation',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      href: '/reports/stock',
      color: '#1976d2',
    },
    {
      title: 'Sales Report',
      description: 'Sales performance, revenue analysis, and customer insights',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      href: '/reports/sales',
      color: '#388e3c',
    },
    {
      title: 'Purchase Report',
      description: 'Purchase analysis, supplier performance, and cost tracking',
      icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
      href: '/reports/purchases',
      color: '#f57c00',
    },
    {
      title: 'Profit & Loss',
      description: 'Financial performance, profit margins, and expense analysis',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      href: '/reports/profit-loss',
      color: '#7b1fa2',
    },
    {
      title: 'Customer Outstanding',
      description: 'Outstanding receivables and credit limit analysis',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      href: '/reports/customer-outstanding',
      color: '#d32f2f',
    },
    {
      title: 'Supplier Outstanding',
      description: 'Outstanding payables and supplier credit analysis',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      href: '/reports/supplier-outstanding',
      color: '#5d4037',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <AssessmentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Reports Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Access comprehensive reports and analytics for your business
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reportCards.map((report, index) => (
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
                        color: report.color,
                        mr: 2,
                      }}
                    >
                      {report.icon}
                    </Box>
                    <Typography variant="h6" component="h2">
                      {report.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={InertiaLink}
                    href={report.href}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: report.color,
                      '&:hover': {
                        backgroundColor: report.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    View Report
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
              startIcon={<AssessmentIcon />}
              component={InertiaLink}
              href="/reports/stock"
            >
              Stock Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              component={InertiaLink}
              href="/reports/sales"
            >
              Sales Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShoppingBagIcon />}
              component={InertiaLink}
              href="/reports/purchases"
            >
              Purchase Report
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ReportsIndex;
