import React, { useState, useEffect } from 'react';
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
import { useAppearance, type Appearance, type PrimaryColor } from '@/hooks/use-appearance';

interface AppearanceSettings {
  theme: string;
  primary_color: string;
  language: string;
  date_format: string;
  time_format: string;
  currency: string;
  timezone: string;
}

interface AppearanceProps {
  settings: AppearanceSettings;
}

export default function Appearance({ settings: initialSettings }: AppearanceProps) {
  const { appearance, updateAppearance, primaryColor, updatePrimaryColor } = useAppearance();
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: initialSettings.theme || appearance,
    primary_color: initialSettings.primary_color || primaryColor,
    sidebar_collapsed: initialSettings.sidebar_collapsed === 'true' || initialSettings.sidebar_collapsed === true,
    language: initialSettings.language || 'en',
    date_format: initialSettings.date_format || 'Y-m-d',
    time_format: initialSettings.time_format || 'H:i:s',
    currency: initialSettings.currency || 'USD',
    timezone: initialSettings.timezone || 'UTC',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync theme and primary color from backend when component mounts
  useEffect(() => {
    if (initialSettings.theme && initialSettings.theme !== appearance) {
      updateAppearance(initialSettings.theme as Appearance);
    }
    if (initialSettings.primary_color && initialSettings.primary_color !== primaryColor) {
      updatePrimaryColor(initialSettings.primary_color as PrimaryColor);
    }
  }, [initialSettings.theme, initialSettings.primary_color, appearance, primaryColor, updateAppearance, updatePrimaryColor]);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ 
      ...prev, 
      [field]: field === 'sidebar_collapsed' ? (value === 'true' || value === true) : value 
    }));
    
    // Update theme immediately when changed
    if (field === 'theme') {
      updateAppearance(value as Appearance);
    }
    
    // Update primary color immediately when changed
    if (field === 'primary_color') {
      updatePrimaryColor(value as PrimaryColor);
    }
  };

  const handleSave = () => {
    setIsSubmitting(true);
    router.post('/settings/appearance', settings, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleBack = () => {
    router.visit('/settings');
  };

  return (
    <Layout title="Appearance Settings - Customize theme, colors, and display preferences">
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
            <Button onClick={handleSave} disabled={isSubmitting}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
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
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <Select value={settings.primary_color} onValueChange={(value) => handleChange('primary_color', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="indigo">Indigo</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="emerald">Emerald</SelectItem>
                    <SelectItem value="lime">Lime</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="violet">Violet</SelectItem>
                    <SelectItem value="rose">Rose</SelectItem>
                    <SelectItem value="slate">Slate</SelectItem>
                  </SelectContent>
                </Select>
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
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="UTC">UTC (Universal Time Coordinated)</SelectItem>
                    
                    {/* Americas */}
                    <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                    <SelectItem value="America/Chicago">America/Chicago (CST/CDT)</SelectItem>
                    <SelectItem value="America/Denver">America/Denver (MST/MDT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</SelectItem>
                    <SelectItem value="America/Toronto">America/Toronto (Canada)</SelectItem>
                    <SelectItem value="America/Vancouver">America/Vancouver (Canada)</SelectItem>
                    <SelectItem value="America/Mexico_City">America/Mexico_City (Mexico)</SelectItem>
                    <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (Brazil)</SelectItem>
                    <SelectItem value="America/Argentina/Buenos_Aires">America/Buenos_Aires (Argentina)</SelectItem>
                    
                    {/* Europe */}
                    <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris (CET/CEST)</SelectItem>
                    <SelectItem value="Europe/Berlin">Europe/Berlin (Germany)</SelectItem>
                    <SelectItem value="Europe/Rome">Europe/Rome (Italy)</SelectItem>
                    <SelectItem value="Europe/Madrid">Europe/Madrid (Spain)</SelectItem>
                    <SelectItem value="Europe/Amsterdam">Europe/Amsterdam (Netherlands)</SelectItem>
                    <SelectItem value="Europe/Brussels">Europe/Brussels (Belgium)</SelectItem>
                    <SelectItem value="Europe/Vienna">Europe/Vienna (Austria)</SelectItem>
                    <SelectItem value="Europe/Zurich">Europe/Zurich (Switzerland)</SelectItem>
                    <SelectItem value="Europe/Stockholm">Europe/Stockholm (Sweden)</SelectItem>
                    <SelectItem value="Europe/Moscow">Europe/Moscow (Russia)</SelectItem>
                    <SelectItem value="Europe/Istanbul">Europe/Istanbul (Turkey)</SelectItem>
                    
                    {/* Asia */}
                    <SelectItem value="Asia/Dubai">Asia/Dubai (UAE)</SelectItem>
                    <SelectItem value="Asia/Karachi">Asia/Karachi (Pakistan)</SelectItem>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (India)</SelectItem>
                    <SelectItem value="Asia/Dhaka">Asia/Dhaka (Bangladesh)</SelectItem>
                    <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (Nepal)</SelectItem>
                    <SelectItem value="Asia/Bangkok">Asia/Bangkok (Thailand)</SelectItem>
                    <SelectItem value="Asia/Jakarta">Asia/Jakarta (Indonesia)</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                    <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (Malaysia)</SelectItem>
                    <SelectItem value="Asia/Manila">Asia/Manila (Philippines)</SelectItem>
                    <SelectItem value="Asia/Hong_Kong">Asia/Hong_Kong</SelectItem>
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai (China)</SelectItem>
                    <SelectItem value="Asia/Taipei">Asia/Taipei (Taiwan)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (Japan)</SelectItem>
                    <SelectItem value="Asia/Seoul">Asia/Seoul (South Korea)</SelectItem>
                    <SelectItem value="Asia/Riyadh">Asia/Riyadh (Saudi Arabia)</SelectItem>
                    <SelectItem value="Asia/Jerusalem">Asia/Jerusalem (Israel)</SelectItem>
                    
                    {/* Australia & Pacific */}
                    <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                    <SelectItem value="Australia/Melbourne">Australia/Melbourne</SelectItem>
                    <SelectItem value="Australia/Brisbane">Australia/Brisbane</SelectItem>
                    <SelectItem value="Australia/Perth">Australia/Perth</SelectItem>
                    <SelectItem value="Pacific/Auckland">Pacific/Auckland (New Zealand)</SelectItem>
                    
                    {/* Africa */}
                    <SelectItem value="Africa/Cairo">Africa/Cairo (Egypt)</SelectItem>
                    <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (South Africa)</SelectItem>
                    <SelectItem value="Africa/Lagos">Africa/Lagos (Nigeria)</SelectItem>
                    <SelectItem value="Africa/Nairobi">Africa/Nairobi (Kenya)</SelectItem>
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
                    <SelectItem value="BDT">Bangladeshi Taka (৳)</SelectItem>
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
                <p><strong>Primary Color:</strong> {settings.primary_color}</p>
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