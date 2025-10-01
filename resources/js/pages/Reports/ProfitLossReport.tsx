import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
} from 'lucide-react';
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
    <Layout title="Profit & Loss Report">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUpIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Report</h1>
          </div>
          <p className="text-muted-foreground">
            Financial performance analysis and profit margins
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="date_from">Date From</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_to">Date To</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button variant="default" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={exportReport}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit & Loss Statement */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profit & Loss Statement</CardTitle>
              <p className="text-sm text-muted-foreground">
                {localFilters.date_from && localFilters.date_to 
                  ? `${new Date(localFilters.date_from).toLocaleDateString()} - ${new Date(localFilters.date_to).toLocaleDateString()}`
                  : 'All Time'
                }
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Revenue Section */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Revenue</h3>
                  <div className="flex justify-between items-center">
                    <span>Total Sales Revenue</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${summary.revenue.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Cost of Goods Sold */}
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Cost of Goods Sold</h3>
                  <div className="flex justify-between items-center">
                    <span>Cost of Goods Sold</span>
                    <span className="text-lg font-semibold text-red-600">
                      ${summary.cost_of_goods_sold.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Gross Profit */}
              <Card className={`border ${summary.gross_profit >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Gross Profit</h3>
                  <div className="flex justify-between items-center">
                    <span>Gross Profit</span>
                    <span className={`text-xl font-semibold ${summary.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${summary.gross_profit.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Margin: {summary.gross_profit_margin.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Operating Expenses</h3>
                  <div className="flex justify-between items-center">
                    <span>Total Expenses</span>
                    <span className="text-lg font-semibold text-orange-600">
                      ${summary.expenses.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Separator className="my-4" />

              {/* Net Profit */}
              <Card className={`border ${summary.net_profit >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Net Profit/Loss</h3>
                  <div className="flex justify-between items-center">
                    <span>Net Profit</span>
                    <span className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${summary.net_profit.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Margin: {summary.net_profit_margin.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-primary">${summary.revenue.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className={`text-2xl font-bold ${summary.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${summary.gross_profit.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Expenses</p>
                    <p className="text-2xl font-bold text-orange-600">${summary.expenses.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${summary.net_profit.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfitLossReport;