<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Sale;
use App\Models\Customer;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalStock' => Stock::sum('qty'),
            'totalSales' => Sale::sum('total_amount'),
            'totalCustomers' => Customer::count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}