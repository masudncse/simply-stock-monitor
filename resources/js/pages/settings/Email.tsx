import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Mail as MailIcon,
  Send as SendIcon,
  Clock as ClockIcon,
  CheckCircle as CheckIcon,
  AlertCircle as ErrorIcon,
  Settings as SettingsIcon,
  TestTube as TestIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface EmailSettingsProps {
  emailSettings: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    smtp_encryption: string;
    smtp_from_address: string;
    smtp_from_name: string;
    smtp_enabled: boolean;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  errors?: {
    message?: string;
  };
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ emailSettings, flash, errors }) => {
  const [settings, setSettings] = useState(emailSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDirect, setIsTestingDirect] = useState(false);
  const [isTestingQueued, setIsTestingQueued] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testResults, setTestResults] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Handle flash messages and errors from backend
  React.useEffect(() => {
    if (flash?.success) {
      setTestResults({
        type: 'success',
        message: flash.success
      });
    } else if (flash?.error) {
      setTestResults({
        type: 'error',
        message: flash.error
      });
    } else if (errors?.message) {
      setTestResults({
        type: 'error',
        message: errors.message
      });
    }
  }, [flash, errors]);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTestResults(null);

    router.post('/settings/email', settings, {
      onSuccess: () => {
        setTestResults({
          type: 'success',
          message: 'Email configuration saved successfully!'
        });
      },
      onError: (errors) => {
        setTestResults({
          type: 'error',
          message: Object.values(errors).flat().join(', ')
        });
      },
      onFinish: () => {
        setIsSaving(false);
      }
    });
  };

  const handleTestDirect = () => {
    if (!testEmail) {
      setTestResults({
        type: 'error',
        message: 'Please enter a test email address'
      });
      return;
    }

    setIsTestingDirect(true);
    setTestResults(null);

    router.post('/settings/email/test-direct', { test_email: testEmail }, {
      onSuccess: () => {
        setTestResults({
          type: 'success',
          message: 'Direct test email sent successfully!'
        });
      },
      onError: (errors) => {
        setTestResults({
          type: 'error',
          message: errors.message || 'Failed to send direct test email'
        });
      },
      onFinish: () => {
        setIsTestingDirect(false);
      }
    });
  };

  const handleTestQueued = () => {
    if (!testEmail) {
      setTestResults({
        type: 'error',
        message: 'Please enter a test email address'
      });
      return;
    }

    setIsTestingQueued(true);
    setTestResults(null);

    router.post('/settings/email/test-queued', { test_email: testEmail }, {
      onSuccess: () => {
        setTestResults({
          type: 'success',
          message: 'Queued test email sent successfully!'
        });
      },
      onError: (errors) => {
        setTestResults({
          type: 'error',
          message: errors.message || 'Failed to queue test email'
        });
      },
      onFinish: () => {
        setIsTestingQueued(false);
      }
    });
  };

  return (
    <Layout title="Email Settings - Configure SMTP and test email functionality">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
            <p className="text-muted-foreground">
              Configure SMTP settings and test email functionality
            </p>
          </div>
          <Button variant="outline" asChild>
            <InertiaLink href="/settings">
              Back to Settings
            </InertiaLink>
          </Button>
        </div>

        {testResults && (
          <Alert variant={testResults.type === 'success' ? 'default' : 'destructive'}>
            {testResults.type === 'success' ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <ErrorIcon className="h-4 w-4" />
            )}
            <AlertDescription>{testResults.message}</AlertDescription>
          </Alert>
        )}

        {/* SMTP Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="h-5 w-5" />
              SMTP Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="smtp_enabled"
                checked={settings.smtp_enabled}
                onCheckedChange={(checked) => handleChange('smtp_enabled', checked)}
              />
              <Label htmlFor="smtp_enabled">Enable SMTP Email</Label>
            </div>

            {settings.smtp_enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={settings.smtp_host}
                      onChange={(e) => handleChange('smtp_host', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={settings.smtp_port}
                      onChange={(e) => handleChange('smtp_port', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_username">Username</Label>
                    <Input
                      id="smtp_username"
                      value={settings.smtp_username}
                      onChange={(e) => handleChange('smtp_username', e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">Password</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={settings.smtp_password}
                      onChange={(e) => handleChange('smtp_password', e.target.value)}
                      placeholder="Your email password or app password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_encryption">Encryption</Label>
                    <Select value={settings.smtp_encryption} onValueChange={(value) => handleChange('smtp_encryption', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_address">From Address</Label>
                    <Input
                      id="smtp_from_address"
                      type="email"
                      value={settings.smtp_from_address}
                      onChange={(e) => handleChange('smtp_from_address', e.target.value)}
                      placeholder="noreply@yourcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_name">From Name</Label>
                    <Input
                      id="smtp_from_name"
                      value={settings.smtp_from_name}
                      onChange={(e) => handleChange('smtp_from_name', e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving ? 'Saving...' : 'Save Email Configuration'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email Testing */}
        {settings.smtp_enabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestIcon className="h-5 w-5" />
                Test Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test_email">Test Email Address</Label>
                <Input
                  id="test_email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleTestDirect}
                  disabled={isTestingDirect || isTestingQueued}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <SendIcon className="h-4 w-4" />
                  {isTestingDirect ? 'Sending...' : 'Send Direct Test'}
                </Button>

                <Button
                  onClick={handleTestQueued}
                  disabled={isTestingDirect || isTestingQueued}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ClockIcon className="h-4 w-4" />
                  {isTestingQueued ? 'Queuing...' : 'Send Queued Test'}
                </Button>
              </div>

              <Alert>
                <SettingsIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Direct Test:</strong> Sends email immediately to test SMTP connection.
                  <br />
                  <strong>Queued Test:</strong> Adds email to queue for testing queue functionality.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Popular SMTP Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Popular SMTP Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Gmail</h4>
                <p className="text-sm text-muted-foreground mb-2">Use Gmail SMTP</p>
                <ul className="text-xs space-y-1">
                  <li>Host: smtp.gmail.com</li>
                  <li>Port: 587 (TLS) or 465 (SSL)</li>
                  <li>Use App Password</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Outlook/Hotmail</h4>
                <p className="text-sm text-muted-foreground mb-2">Use Outlook SMTP</p>
                <ul className="text-xs space-y-1">
                  <li>Host: smtp-mail.outlook.com</li>
                  <li>Port: 587 (TLS)</li>
                  <li>Use your email password</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">SendGrid</h4>
                <p className="text-sm text-muted-foreground mb-2">Professional email service</p>
                <ul className="text-xs space-y-1">
                  <li>Host: smtp.sendgrid.net</li>
                  <li>Port: 587 (TLS)</li>
                  <li>Use API Key as password</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EmailSettings;
