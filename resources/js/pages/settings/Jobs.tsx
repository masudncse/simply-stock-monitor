import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Trash2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Job {
  id: number;
  queue: string;
  job_name: string;
  attempts: number;
  created_at: string;
  available_at: string;
  reserved_at: string | null;
}

interface JobsProps {
  jobs: {
    data: Job[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
}

export default function Jobs({ jobs }: JobsProps) {
  const handleDelete = (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      router.delete(`/settings/jobs/${jobId}`);
    }
  };

  const handlePurgeAll = () => {
    if (confirm('Are you sure you want to delete ALL pending jobs? This action cannot be undone.')) {
      router.post('/settings/jobs/purge');
    }
  };

  const handlePageChange = (page: number) => {
    router.get('/settings/jobs', { page });
  };

  return (
    <Layout title="Job Management - Manage queue jobs">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage pending queue jobs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/settings/jobs/failed">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Failed Jobs
              </Link>
            </Button>
            {jobs.total > 0 && (
              <Button variant="destructive" onClick={handlePurgeAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Jobs
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Jobs ({jobs.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.data.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No pending jobs in queue</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Jobs will appear here when they are queued for processing
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Queue</TableHead>
                      <TableHead className="text-right">Attempts</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Available At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.data.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-sm">{job.id}</TableCell>
                        <TableCell className="font-medium">{job.job_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.queue}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{job.attempts}</TableCell>
                        <TableCell className="text-sm">{job.created_at}</TableCell>
                        <TableCell className="text-sm">{job.available_at}</TableCell>
                        <TableCell>
                          {job.reserved_at ? (
                            <Badge className="bg-yellow-500">Processing</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <CustomPagination
                  className="mt-6"
                  pagination={jobs}
                  onPageChange={handlePageChange}
                  showPerPageOptions={false}
                  showInfo={true}
                  showFirstLast={true}
                  maxVisiblePages={5}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

