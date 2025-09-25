import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '../layouts/Layout';
import {
  Package as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Users as PeopleIcon,
} from 'lucide-react';

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
    <Layout title="Dashboard">
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
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Point of Sale</h3>
                  <p className="text-sm text-muted-foreground">Process sales quickly</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <InventoryIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Add Products</h3>
                  <p className="text-sm text-muted-foreground">Manage your inventory</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <PeopleIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Customers</h3>
                  <p className="text-sm text-muted-foreground">View customer information</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}