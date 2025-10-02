import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CustomPagination from '@/components/CustomPagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Trash2,
  RefreshCw,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface FailedJob {
  id: number;
  uuid: string;
  queue: string;
  connection: string;
  exception: string;
  full_exception: string;
  failed_at: string;
}

interface FailedJobsProps {
  failedJobs: {
    data: FailedJob[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
}

export default function FailedJobs({ failedJobs }: FailedJobsProps) {
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FailedJob | null>(null);

  const handleDelete = (jobId: number) => {
    if (confirm('Are you sure you want to delete this failed job?')) {
      router.delete(`/settings/jobs/failed/${jobId}`);
    }
  };

  const handleRetry = (jobId: number) => {
    router.post(`/settings/jobs/failed/${jobId}/retry`);
  };

  const handleRetryAll = () => {
    if (confirm('Are you sure you want to retry all failed jobs?')) {
      router.post('/settings/jobs/failed/retry-all');
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL failed jobs? This action cannot be undone.')) {
      router.post('/settings/jobs/failed/clear');
    }
  };

  const handlePageChange = (page: number) => {
    router.get('/settings/jobs/failed', { page });
  };

  const showException = (job: FailedJob) => {
    setSelectedJob(job);
    setExceptionModalOpen(true);
  };

  return (
    <Layout title="Failed Jobs - View and manage failed queue jobs">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Failed Jobs</h1>
            <p className="text-muted-foreground">
              View and retry jobs that failed during processing
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/settings/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
            {failedJobs.total > 0 && (
              <>
                <Button onClick={handleRetryAll} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry All
                </Button>
                <Button variant="destructive" onClick={handleClearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Failed Jobs ({failedJobs.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {failedJobs.data.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No failed jobs</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Great! All jobs are processing successfully
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>UUID</TableHead>
                      <TableHead>Queue</TableHead>
                      <TableHead>Connection</TableHead>
                      <TableHead>Exception</TableHead>
                      <TableHead>Failed At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedJobs.data.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-sm">{job.id}</TableCell>
                        <TableCell className="font-mono text-xs">{job.uuid.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.queue}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{job.connection}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md truncate text-sm text-destructive">
                            {job.exception}
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => showException(job)}
                          >
                            View Full Exception
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm">{job.failed_at}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetry(job.id)}
                              title="Retry this job"
                            >
                              <RefreshCw className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(job.id)}
                              title="Delete this job"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <CustomPagination
                  className="mt-6"
                  pagination={failedJobs}
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

        {/* Exception Modal */}
        <Dialog open={exceptionModalOpen} onOpenChange={setExceptionModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Exception Details</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job UUID</p>
                  <p className="font-mono text-sm">{selectedJob.uuid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Queue</p>
                  <p className="text-sm">{selectedJob.queue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed At</p>
                  <p className="text-sm">{selectedJob.failed_at}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Full Exception</p>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                    {selectedJob.full_exception}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

