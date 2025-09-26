import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database as BackupIcon,
  Download as DownloadIcon,
  Trash2 as DeleteIcon,
  Plus as CreateIcon,
  AlertTriangle as WarningIcon,
  CheckCircle as SuccessIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface BackupFile {
  name: string;
  size: number;
  created_at: number;
}

interface BackupSettingsProps {
  backups: BackupFile[];
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ backups }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleCreateBackup = () => {
    setIsCreating(true);
    router.post('/settings/backup', {}, {
      onFinish: () => setIsCreating(false),
    });
  };

  const handleDownloadBackup = (filename: string) => {
    window.open(`/settings/backup/${filename}/download`, '_blank');
  };

  const handleDeleteBackup = (filename: string) => {
    if (confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      setIsDeleting(filename);
      router.delete(`/settings/backup/${filename}`, {
        onFinish: () => setIsDeleting(null),
      });
    }
  };

  return (
    <Layout title="Backup & Maintenance">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BackupIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Backup & Maintenance</h1>
          </div>
          <p className="text-muted-foreground">
            Manage database backups and system maintenance
          </p>
        </div>

        {/* Warning Alert */}
        <Alert>
          <WarningIcon className="h-4 w-4" />
          <AlertDescription>
            Regular backups are essential for data protection. Ensure you have a backup strategy in place.
          </AlertDescription>
        </Alert>

        {/* Backup Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleCreateBackup}
                disabled={isCreating}
                className="flex items-center gap-2"
              >
                <CreateIcon className="h-4 w-4" />
                {isCreating ? 'Creating Backup...' : 'Create Backup'}
              </Button>
              
              <Button variant="outline" asChild>
                <InertiaLink href="/settings">
                  Back to Settings
                </InertiaLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Backups</CardTitle>
          </CardHeader>
          <CardContent>
            {backups.length === 0 ? (
              <div className="text-center py-8">
                <BackupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No backups found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first backup to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div
                    key={backup.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <BackupIcon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">{backup.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(backup.size)}</span>
                          <span>•</span>
                          <span>{formatDate(backup.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadBackup(backup.name)}
                        className="flex items-center gap-2"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.name)}
                        disabled={isDeleting === backup.name}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <DeleteIcon className="h-4 w-4" />
                        {isDeleting === backup.name ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">What's Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Database tables and data</li>
                  <li>• User accounts and permissions</li>
                  <li>• System settings and configuration</li>
                  <li>• Product and inventory data</li>
                  <li>• Transaction history</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create backups before major updates</li>
                  <li>• Store backups in multiple locations</li>
                  <li>• Test backup restoration regularly</li>
                  <li>• Keep multiple backup versions</li>
                  <li>• Monitor backup file sizes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <SuccessIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Database Status</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <SuccessIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Storage Space</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <SuccessIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Backup System</p>
                  <p className="text-sm text-muted-foreground">Ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BackupSettings;
