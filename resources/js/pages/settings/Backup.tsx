import React, { useState } from 'react';
import { Link as InertiaLink, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Database as BackupIcon,
  Database as Database,
  Download as DownloadIcon,
  Trash2 as DeleteIcon,
  Plus as CreateIcon,
  AlertTriangle as WarningIcon,
  CheckCircle as SuccessIcon,
  RotateCcw as RestoreIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import Layout from '../../layouts/Layout';

interface BackupFile {
  filename: string;
  filepath: string;
  size: number;
  created_at: string;
  is_compressed: boolean;
}

interface BackupSettingsProps {
  backups: BackupFile[];
  diskConfig: {
    disk: string;
    path: string;
    total_size: number;
    backup_count: number;
    mysql_path: string;
    mysqldump_path: string;
  };
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ backups, diskConfig }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [compressBackup, setCompressBackup] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<string | null>(null);
  const [selectedBackupForDelete, setSelectedBackupForDelete] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleCreateBackup = () => {
    setIsCreating(true);
    router.post('/settings/backup', { compress: compressBackup }, {
      onFinish: () => setIsCreating(false),
    });
  };

  const handleDownloadBackup = (filename: string) => {
    window.open(`/settings/backup/${filename}/download`, '_blank');
  };

  const handleDeleteBackup = (filename: string) => {
    setSelectedBackupForDelete(filename);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBackupForDelete) {
      setIsDeleting(selectedBackupForDelete);
      router.delete(`/settings/backup/${selectedBackupForDelete}`, {
        onFinish: () => {
          setIsDeleting(null);
          setDeleteDialogOpen(false);
          setSelectedBackupForDelete(null);
        },
      });
    }
  };

  const handleRestoreBackup = (filename: string) => {
    setSelectedBackupForRestore(filename);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (selectedBackupForRestore) {
      setIsRestoring(selectedBackupForRestore);
      router.post('/settings/backup/restore', { filename: selectedBackupForRestore }, {
        onFinish: () => {
          setIsRestoring(null);
          setRestoreDialogOpen(false);
          setSelectedBackupForRestore(null);
        },
      });
    }
  };

  return (
    <Layout title="Backup & Maintenance - Manage database backups and system maintenance">
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
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="compress-backup"
                  checked={compressBackup}
                  onCheckedChange={setCompressBackup}
                />
                <Label htmlFor="compress-backup">Compress backup (saves space)</Label>
              </div>
              
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
                    key={backup.filename}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {backup.is_compressed ? (
                        <ArchiveIcon className="h-8 w-8 text-primary" />
                      ) : (
                        <BackupIcon className="h-8 w-8 text-primary" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{backup.filename}</h3>
                          {backup.is_compressed && (
                            <Badge variant="secondary" className="text-xs">Compressed</Badge>
                          )}
                        </div>
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
                        onClick={() => handleDownloadBackup(backup.filename)}
                        className="flex items-center gap-2"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.filename)}
                        disabled={isRestoring === backup.filename}
                        className="flex items-center gap-2"
                      >
                        <RestoreIcon className="h-4 w-4" />
                        {isRestoring === backup.filename ? 'Restoring...' : 'Restore'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.filename)}
                        disabled={isDeleting === backup.filename}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <DeleteIcon className="h-4 w-4" />
                        {isDeleting === backup.filename ? 'Deleting...' : 'Delete'}
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
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">System Configuration</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">MySQL Path:</span>
                  </div>
                  <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded font-mono">
                    {diskConfig.mysql_path || 'Not detected'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">mysqldump Path:</span>
                  </div>
                  <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded font-mono">
                    {diskConfig.mysqldump_path || 'Not detected'}
                  </div>
                </div>
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

        {/* Restore Confirmation Dialog */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Database Restore</DialogTitle>
              <DialogDescription>
                Are you sure you want to restore the database from this backup? This action will replace all current data and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <WarningIcon className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This will completely replace your current database with the backup data. All current data will be lost.
                    </p>
                  </div>
                </div>
              </div>
              {selectedBackupForRestore && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Selected backup:</p>
                  <p className="text-sm text-gray-600">{selectedBackupForRestore}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRestoreDialogOpen(false)}
                disabled={isRestoring === selectedBackupForRestore}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRestore}
                disabled={isRestoring === selectedBackupForRestore}
                className="flex items-center gap-2"
              >
                <RestoreIcon className="h-4 w-4" />
                {isRestoring === selectedBackupForRestore ? 'Restoring...' : 'Restore Database'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Backup Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this backup? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <WarningIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Warning</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      This will permanently delete the backup file. Make sure you have downloaded it if needed.
                    </p>
                  </div>
                </div>
              </div>
              {selectedBackupForDelete && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Selected backup:</p>
                  <p className="text-sm text-gray-600">{selectedBackupForDelete}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting === selectedBackupForDelete}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting === selectedBackupForDelete}
                className="flex items-center gap-2"
              >
                <DeleteIcon className="h-4 w-4" />
                {isDeleting === selectedBackupForDelete ? 'Deleting...' : 'Delete Backup'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BackupSettings;
