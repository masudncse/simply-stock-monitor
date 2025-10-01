import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '../layouts/Layout';
import { router } from '@inertiajs/react';
import {
  Package as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Users as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  DollarSign as CashIcon,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  stats: {
    totalProducts: number;
    totalStock: number;
    totalSales: number;
    totalCustomers: number;
  };
  chartData: Array<{
    day: string;
    sales: number;
    purchases: number;
    receivableDues: number;
    payableDues: number;
    cashFlow: number;
  }>;
  currentCashBalance: {
    currentBalance: number;
    totalSales: number;
    totalPurchases: number;
    outstandingReceivables: number;
    outstandingPayables: number;
  };
}

export default function Dashboard({ stats, chartData, currentCashBalance }: DashboardProps) {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Stock Value',
      value: `$${stats.totalStock.toLocaleString()}`,
      icon: <StoreIcon className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Current Cash Balance',
      value: `$${currentCashBalance.currentBalance.toLocaleString()}`,
      icon: <CashIcon className="h-8 w-8" />,
      color: currentCashBalance.currentBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: currentCashBalance.currentBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: <ShoppingCartIcon className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <PeopleIcon className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Layout title="Dashboard - Overview of your business performance">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Stock Management System. Here's an overview of your business.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <div className={card.color}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts to help you manage your business efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button 
                variant="ghost" 
                className="h-auto p-4 justify-start"
                onClick={() => router.visit('/pos')}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Point of Sale</h3>
                    <p className="text-sm text-muted-foreground">Process sales quickly</p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="h-auto p-4 justify-start"
                onClick={() => router.visit('/products/create')}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <InventoryIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Add Products</h3>
                    <p className="text-sm text-muted-foreground">Manage your inventory</p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="h-auto p-4 justify-start"
                onClick={() => router.visit('/customers')}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <PeopleIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Manage Customers</h3>
                    <p className="text-sm text-muted-foreground">View customer information</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Cash Flow - Last 7 Days
              </CardTitle>
              <CardDescription>
                Daily cash flow (Sales - Purchases) over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`, 
                      name === 'cashFlow' ? 'Cash Flow' : name
                    ]}
                  />
                  <Bar 
                    dataKey="cashFlow" 
                    fill={chartData.some(d => d.cashFlow < 0) ? "#ef4444" : "#10b981"} 
                    name="Cash Flow"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales vs Purchases Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                Sales vs Purchases - Last 7 Days
              </CardTitle>
              <CardDescription>
                Daily sales and purchase amounts comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`, 
                      name === 'sales' ? 'Sales' : name === 'purchases' ? 'Purchases' : name
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="purchases" stroke="#ef4444" strokeWidth={2} name="Purchases" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Receivable vs Payable Dues Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CashIcon className="h-5 w-5" />
                Receivable vs Payable Dues - Last 7 Days
              </CardTitle>
              <CardDescription>
                Outstanding amounts: money owed to us vs money we owe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`, 
                      name === 'receivableDues' ? 'Receivable Dues' : name === 'payableDues' ? 'Payable Dues' : name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="receivableDues" fill="#10b981" name="Receivable Dues" />
                  <Bar dataKey="payableDues" fill="#ef4444" name="Payable Dues" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Balance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CashIcon className="h-5 w-5" />
                Cash Balance Summary
              </CardTitle>
              <CardDescription>
                Current financial position overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${currentCashBalance.totalSales.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    ${currentCashBalance.totalPurchases.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Purchases</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${currentCashBalance.outstandingReceivables.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Outstanding Receivables</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    ${currentCashBalance.outstandingPayables.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Outstanding Payables</div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold ${currentCashBalance.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${currentCashBalance.currentBalance.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Current Cash Balance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}