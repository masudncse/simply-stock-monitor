<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class JobManagementController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display all jobs
     */
    public function index(Request $request)
    {
        $this->authorize('view-settings');

        $perPage = $request->get('per_page', 15);
        
        // Get pending jobs
        $jobs = DB::table('jobs')
            ->select('id', 'queue', 'payload', 'attempts', 'created_at', 'available_at', 'reserved_at')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->through(function ($job) {
                $payload = json_decode($job->payload, true);
                return [
                    'id' => $job->id,
                    'queue' => $job->queue,
                    'job_name' => $payload['displayName'] ?? 'Unknown',
                    'attempts' => $job->attempts,
                    'created_at' => date('Y-m-d H:i:s', $job->created_at),
                    'available_at' => date('Y-m-d H:i:s', $job->available_at),
                    'reserved_at' => $job->reserved_at ? date('Y-m-d H:i:s', $job->reserved_at) : null,
                ];
            });

        return Inertia::render('Settings/Jobs', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Display failed jobs
     */
    public function failed(Request $request)
    {
        $this->authorize('view-settings');

        $perPage = $request->get('per_page', 15);
        
        $failedJobs = DB::table('failed_jobs')
            ->select('id', 'uuid', 'queue', 'connection', 'exception', 'failed_at')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->through(function ($job) {
                // Extract just the first line of the exception for display
                $exceptionLines = explode("\n", $job->exception);
                $shortException = $exceptionLines[0] ?? 'Unknown error';
                
                return [
                    'id' => $job->id,
                    'uuid' => $job->uuid,
                    'queue' => $job->queue,
                    'connection' => $job->connection,
                    'exception' => $shortException,
                    'full_exception' => $job->exception,
                    'failed_at' => $job->failed_at,
                ];
            });

        return Inertia::render('Settings/FailedJobs', [
            'failedJobs' => $failedJobs,
        ]);
    }

    /**
     * Delete a pending job
     */
    public function destroy($jobId)
    {
        $this->authorize('edit-settings');

        DB::table('jobs')->where('id', $jobId)->delete();

        return redirect()->back()
            ->with('success', 'Job deleted successfully.');
    }

    /**
     * Delete a failed job
     */
    public function destroyFailed($jobId)
    {
        $this->authorize('edit-settings');

        DB::table('failed_jobs')->where('id', $jobId)->delete();

        return redirect()->back()
            ->with('success', 'Failed job deleted successfully.');
    }

    /**
     * Retry a failed job
     */
    public function retry($jobId)
    {
        $this->authorize('edit-settings');

        $failedJob = DB::table('failed_jobs')->where('id', $jobId)->first();
        
        if (!$failedJob) {
            return redirect()->back()
                ->with('error', 'Failed job not found.');
        }

        // Use artisan command to retry the job by UUID
        Artisan::call('queue:retry', ['id' => [$failedJob->uuid]]);

        return redirect()->back()
            ->with('success', 'Job queued for retry successfully.');
    }

    /**
     * Retry all failed jobs
     */
    public function retryAll()
    {
        $this->authorize('edit-settings');

        Artisan::call('queue:retry', ['id' => ['all']]);

        return redirect()->back()
            ->with('success', 'All failed jobs queued for retry.');
    }

    /**
     * Clear all failed jobs
     */
    public function clearFailed()
    {
        $this->authorize('edit-settings');

        Artisan::call('queue:flush');

        return redirect()->back()
            ->with('success', 'All failed jobs cleared.');
    }

    /**
     * Purge all pending jobs
     */
    public function purgeAll()
    {
        $this->authorize('edit-settings');

        DB::table('jobs')->truncate();

        return redirect()->back()
            ->with('success', 'All pending jobs cleared.');
    }
}
