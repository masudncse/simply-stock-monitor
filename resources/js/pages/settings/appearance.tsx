import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Save as SaveIcon,
  ArrowLeft as BackIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface AppearanceSettings {
  theme: string;
  sidebar_collapsed: boolean;
  language: string;
  date_format: string;
  time_format: string;
  currency: string;
  timezone: string;
}

export default function Appearance() {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'system',
    sidebar_collapsed: false,
    language: 'en',
    date_format: 'Y-m-d',
    time_format: 'H:i:s',
    currency: 'USD',
    timezone: 'UTC',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving appearance settings:', settings);
    // router.post('/settings/appearance', settings);
  };

  const handleBack = () => {
    router.visit('/settings');
  };

  return (
    <Layout title="Appearance Settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appearance Settings</h1>
            <p className="text-muted-foreground">
              Customize theme, colors, and display preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
            <Button onClick={handleSave}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleChange('theme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sidebar_collapsed"
                  checked={settings.sidebar_collapsed}
                  onCheckedChange={(checked) => handleChange('sidebar_collapsed', checked)}
                />
                <Label htmlFor="sidebar_collapsed">Collapse Sidebar by Default</Label>
              </div>
            </CardContent>
          </Card>

          {/* Language & Localization */}
          <Card>
            <CardHeader>
              <CardTitle>Language & Localization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Format */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date_format">Date Format</Label>
                <Select value={settings.date_format} onValueChange={(value) => handleChange('date_format', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y-m-d">YYYY-MM-DD</SelectItem>
                    <SelectItem value="m/d/Y">MM/DD/YYYY</SelectItem>
                    <SelectItem value="d/m/Y">DD/MM/YYYY</SelectItem>
                    <SelectItem value="d-m-Y">DD-MM-YYYY</SelectItem>
                    <SelectItem value="M d, Y">MMM DD, YYYY</SelectItem>
                    <SelectItem value="d M Y">DD MMM YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_format">Time Format</Label>
                <Select value={settings.time_format} onValueChange={(value) => handleChange('time_format', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H:i:s">24 Hour (HH:MM:SS)</SelectItem>
                    <SelectItem value="h:i:s A">12 Hour (HH:MM:SS AM/PM)</SelectItem>
                    <SelectItem value="H:i">24 Hour (HH:MM)</SelectItem>
                    <SelectItem value="h:i A">12 Hour (HH:MM AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                    <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                    <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                    <SelectItem value="CHF">Swiss Franc (CHF)</SelectItem>
                    <SelectItem value="CNY">Chinese Yuan (¥)</SelectItem>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="BRL">Brazilian Real (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Current settings preview:
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Theme:</strong> {settings.theme}</p>
                <p><strong>Language:</strong> {settings.language}</p>
                <p><strong>Date Format:</strong> {settings.date_format}</p>
                <p><strong>Time Format:</strong> {settings.time_format}</p>
                <p><strong>Currency:</strong> {settings.currency}</p>
                <p><strong>Timezone:</strong> {settings.timezone}</p>
                <p><strong>Sidebar Collapsed:</strong> {settings.sidebar_collapsed ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}