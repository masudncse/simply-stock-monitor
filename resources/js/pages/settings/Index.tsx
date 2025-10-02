import React from 'react';
import { Link as InertiaLink } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings as SettingsIcon,
  Building2 as BusinessIcon,
  Building2,
  Settings2 as TuneIcon,
  Users as PeopleIcon,
  Shield as SecurityIcon,
  Database as BackupIcon,
  Palette as PaletteIcon,
  Mail as MailIcon,
  Telescope as TelescopeIcon,
  ListTodo as JobIcon,
  Truck as CourierIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

const SettingsIndex: React.FC = () => {
  const settingsCards = [
    {
      title: 'Company Settings',
      description: 'Configure company information, contact details, and branding',
      icon: <BusinessIcon className="h-10 w-10" />,
      href: '/settings/company',
      color: 'text-blue-600',
    },
    {
      title: 'System Settings',
      description: 'Configure system behavior, defaults, and operational settings',
      icon: <TuneIcon className="h-10 w-10" />,
      href: '/settings/system',
      color: 'text-green-600',
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <PeopleIcon className="h-10 w-10" />,
      href: '/settings/users',
      color: 'text-orange-600',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure user roles and access permissions',
      icon: <SecurityIcon className="h-10 w-10" />,
      href: '/settings/roles',
      color: 'text-purple-600',
    },
    {
      title: 'Email Settings',
      description: 'Configure SMTP settings and test email functionality',
      icon: <MailIcon className="h-10 w-10" />,
      href: '/settings/email',
      color: 'text-red-600',
    },
    {
      title: 'Backup & Maintenance',
      description: 'Database backup, maintenance, and system health',
      icon: <BackupIcon className="h-10 w-10" />,
      href: '/settings/backup',
      color: 'text-indigo-600',
    },
    {
      title: 'Job Management',
      description: 'Monitor queue jobs, view failed jobs, and retry operations',
      icon: <JobIcon className="h-10 w-10" />,
      href: '/settings/jobs',
      color: 'text-teal-600',
    },
    {
      title: 'Application Monitoring',
      description: 'Monitor requests, logs, queues, emails, and notifications',
      icon: <TelescopeIcon className="h-10 w-10" />,
      href: '/telescope',
      color: 'text-cyan-600',
    },
    {
      title: 'Appearance',
      description: 'Customize theme, colors, and display preferences',
      icon: <PaletteIcon className="h-10 w-10" />,
      href: '/settings/appearance',
      color: 'text-amber-600',
    },
    {
      title: 'Warehouse Management',
      description: 'Manage warehouses, locations, and inventory storage',
      icon: <Building2 className="h-10 w-10" />,
      href: '/warehouses',
      color: 'text-indigo-600',
    },
    {
      title: 'Courier Management',
      description: 'Manage courier services, shipping rates, and delivery partners',
      icon: <CourierIcon className="h-10 w-10" />,
      href: '/couriers',
      color: 'text-sky-600',
    },
  ];

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your Stock Management System
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsCards.map((setting, index) => (
            <Card key={index} className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={setting.color}>
                    {setting.icon}
                  </div>
                  <CardTitle className="text-lg">{setting.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full">
                  <InertiaLink href={setting.href}>
                    Configure
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
                <InertiaLink href="/settings/company">
                  <BusinessIcon className="mr-2 h-4 w-4" />
                  Company Info
                </InertiaLink>
              </Button>
              <Button variant="outline" asChild>
                <InertiaLink href="/settings/system">
                  <TuneIcon className="mr-2 h-4 w-4" />
                  System Config
                </InertiaLink>
              </Button>
              <Button variant="outline" asChild>
                <InertiaLink href="/settings/users">
                  <PeopleIcon className="mr-2 h-4 w-4" />
                  Manage Users
                </InertiaLink>
              </Button>
              <Button variant="outline" asChild>
                <InertiaLink href="/settings/backup">
                  <BackupIcon className="mr-2 h-4 w-4" />
                  Backup Data
                </InertiaLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Application Version</p>
                <p className="font-medium">v1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PHP Version</p>
                <p className="font-medium">{typeof window !== 'undefined' ? '8.3.21' : 'PHP 8.3+'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laravel Version</p>
                <p className="font-medium">12.x</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="font-medium">MySQL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsIndex;
