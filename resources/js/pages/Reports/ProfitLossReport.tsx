import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Layout from '../../layouts/Layout';

interface ProfitLossReportProps {
  summary: {
    revenue: number;
    cost_of_goods_sold: number;
    gross_profit: number;
    expenses: number;
    net_profit: number;
    gross_profit_margin: number;
    net_profit_margin: number;
  };
  filters: {
    date_from?: string;
    date_to?: string;
  };
}

const ProfitLossReport: React.FC<ProfitLossReportProps> = ({
  summary,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (field: string, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/reports/profit-loss', localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get('/reports/profit-loss', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const exportReport = () => {
    router.post('/reports/export', {
      report_type: 'profit-loss',
      data: summary,
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <TrendingUpIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Profit & Loss Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Financial performance analysis and profit margins
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Date Range
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date From"
                value={localFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date To"
                value={localFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={applyFilters} size="small">
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={clearFilters} size="small">
                  Clear
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportReport}
                size="small"
              >
                Export PDF
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Profit & Loss Statement */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h2">
              Profit & Loss Statement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {localFilters.date_from && localFilters.date_to 
                ? `${new Date(localFilters.date_from).toLocaleDateString()} - ${new Date(localFilters.date_to).toLocaleDateString()}`
                : 'All Time'
              }
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {/* Revenue Section */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Revenue
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Total Sales Revenue</Typography>
                  <Typography variant="h6" color="primary">
                    ${summary.revenue.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Cost of Goods Sold */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  Cost of Goods Sold
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Cost of Goods Sold</Typography>
                  <Typography variant="h6" color="error">
                    ${summary.cost_of_goods_sold.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Gross Profit */}
            <Card sx={{ mb: 2, backgroundColor: summary.gross_profit >= 0 ? 'success.light' : 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gross Profit
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Gross Profit</Typography>
                  <Typography variant="h5" color={summary.gross_profit >= 0 ? 'success.main' : 'error.main'}>
                    ${summary.gross_profit.toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Margin: {summary.gross_profit_margin.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="warning.main">
                  Operating Expenses
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Total Expenses</Typography>
                  <Typography variant="h6" color="warning.main">
                    ${summary.expenses.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Divider sx={{ my: 2 }} />

            {/* Net Profit */}
            <Card sx={{ backgroundColor: summary.net_profit >= 0 ? 'success.light' : 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Net Profit/Loss
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Net Profit</Typography>
                  <Typography variant="h4" color={summary.net_profit >= 0 ? 'success.main' : 'error.main'}>
                    ${summary.net_profit.toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Margin: {summary.net_profit_margin.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ${summary.revenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Gross Profit
                  </Typography>
                  <Typography variant="h4" color={summary.gross_profit >= 0 ? 'success.main' : 'error.main'}>
                    ${summary.gross_profit.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Expenses
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    ${summary.expenses.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Net Profit
                  </Typography>
                  <Typography variant="h4" color={summary.net_profit >= 0 ? 'success.main' : 'error.main'}>
                    ${summary.net_profit.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ProfitLossReport;
