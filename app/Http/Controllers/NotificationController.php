<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'data' => $notification->data,
                    'read' => $notification->read,
                    'read_at' => $notification->read_at,
                    'time_ago' => $notification->time_ago,
                    'formatted_time' => $notification->formatted_time,
                    'created_at' => $notification->created_at,
                ];
            });

        $unreadCount = Notification::getUnreadCountForUser($request->user()->id);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, int $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'unread_count' => Notification::getUnreadCountForUser($request->user()->id),
            ]);
        }

        return redirect()->back();
    }

    public function markAllAsRead(Request $request)
    {
        $count = Notification::markAllAsReadForUser($request->user()->id);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'marked_count' => $count,
                'unread_count' => 0,
            ]);
        }

        return redirect()->back();
    }

    public function delete(Request $request, int $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'unread_count' => Notification::getUnreadCountForUser($request->user()->id),
            ]);
        }

        return redirect()->back();
    }

    public function getUnreadCount(Request $request): JsonResponse
    {
        $unreadCount = Notification::getUnreadCountForUser($request->user()->id);

        return response()->json([
            'unread_count' => $unreadCount,
        ]);
    }
}
