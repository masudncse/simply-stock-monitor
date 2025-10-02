import React from 'react';
import { Link as InertiaLink } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3 as AssessmentIcon,
  Package as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  TrendingUp as TrendingUpIcon,
  Users as PeopleIcon,
  Building2 as BusinessIcon,
  Scale as TrialBalanceIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

const ReportsIndex: React.FC = () => {
  const reportCards = [
    {
      title: 'Stock Report',
      description: 'Current stock levels, low stock alerts, and stock valuation',
      icon: <InventoryIcon className="h-10 w-10" />,
      href: '/reports/stock',
      color: 'text-blue-600',
    },
    {
      title: 'Sales Report',
      description: 'Sales performance, revenue analysis, and customer insights',
      icon: <ShoppingCartIcon className="h-10 w-10" />,
      href: '/reports/sales',
      color: 'text-green-600',
    },
    {
      title: 'Purchase Report',
      description: 'Purchase analysis, supplier performance, and cost tracking',
      icon: <ShoppingBagIcon className="h-10 w-10" />,
      href: '/reports/purchases',
      color: 'text-orange-600',
    },
    {
      title: 'Profit & Loss',
      description: 'Financial performance, profit margins, and expense analysis',
      icon: <TrendingUpIcon className="h-10 w-10" />,
      href: '/reports/profit-loss',
      color: 'text-purple-600',
    },
    {
      title: 'Customer Outstanding',
      description: 'Outstanding receivables and credit limit analysis',
      icon: <PeopleIcon className="h-10 w-10" />,
      href: '/reports/customer-outstanding',
      color: 'text-red-600',
    },
    {
      title: 'Supplier Outstanding',
      description: 'Outstanding payables and supplier credit analysis',
      icon: <BusinessIcon className="h-10 w-10" />,
      href: '/reports/supplier-outstanding',
      color: 'text-amber-600',
    },
    {
      title: 'Trial Balance',
      description: 'Complete list of all accounts with debit and credit balances',
      icon: <TrialBalanceIcon className="h-10 w-10" />,
      href: '/accounts/trial-balance',
      color: 'text-indigo-600',
    },
  ];

  return (
    <Layout title="Reports Dashboard">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AssessmentIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Access comprehensive reports and analytics for your business
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reportCards.map((report, index) => (
            <Card key={index} className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={report.color}>
                    {report.icon}
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full">
                  <InertiaLink href={report.href}>
                    View Report
                  </InertiaLink>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <InertiaLink href="/reports/stock">
                  <InventoryIcon className="mr-2 h-4 w-4" />
                  Stock Report
                </InertiaLink>
              </Button>
              <Button variant="outline" asChild>
                <InertiaLink href="/reports/sales">
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  Sales Report
                </InertiaLink>
              </Button>
              <Button variant="outline" asChild>
                <InertiaLink href="/reports/purchases">
                  <ShoppingBagIcon className="mr-2 h-4 w-4" />
                  Purchase Report
                </InertiaLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsIndex;