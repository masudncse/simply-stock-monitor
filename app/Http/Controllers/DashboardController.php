<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Purchase;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

        // Get chart data for the last 7 days
        $chartData = $this->getChartData();
        
        // Get current cash balance
        $currentCashBalance = $this->getCurrentCashBalance();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'currentCashBalance' => $currentCashBalance,
        ]);
    }

    private function getChartData()
    {
        $chartData = [];

        // Generate last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateString = $date->format('Y-m-d');
            $dayLabel = $date->format('M d');
            
            // Sales data for this date (cash inflow)
            $dailySales = Sale::whereDate('sale_date', $dateString)->sum('total_amount');
            
            // Purchase data for this date (cash outflow)
            $dailyPurchases = Purchase::whereDate('purchase_date', $dateString)->sum('total_amount');
            
            // Receivable dues (amounts owed to us) for this date
            $dailyReceivableDues = Sale::whereDate('sale_date', $dateString)
                ->whereColumn('total_amount', '>', 'paid_amount')
                ->sum(DB::raw('total_amount - paid_amount'));
            
            // Payable dues (amounts we owe to suppliers) for this date
            $dailyPayableDues = Purchase::whereDate('purchase_date', $dateString)
                ->whereColumn('total_amount', '>', 'paid_amount')
                ->sum(DB::raw('total_amount - paid_amount'));
            
            // Cash flow for this day (sales - purchases)
            $cashFlow = (float) $dailySales - (float) $dailyPurchases;

            $chartData[] = [
                'day' => $dayLabel,
                'sales' => (float) $dailySales,
                'purchases' => (float) $dailyPurchases,
                'receivableDues' => (float) $dailyReceivableDues,
                'payableDues' => (float) $dailyPayableDues,
                'cashFlow' => $cashFlow,
            ];
        }

        return $chartData;
    }

    private function getCurrentCashBalance()
    {
        // Calculate total cash inflow (from sales)
        $totalSales = Sale::sum('total_amount');
        
        // Calculate total cash outflow (from purchases)
        $totalPurchases = Purchase::sum('total_amount');
        
        // Calculate outstanding receivables (sales not yet paid)
        $outstandingReceivables = Sale::whereColumn('total_amount', '>', 'paid_amount')
            ->sum(DB::raw('total_amount - paid_amount'));
        
        // Calculate outstanding payables (purchases not yet paid)
        $outstandingPayables = Purchase::whereColumn('total_amount', '>', 'paid_amount')
            ->sum(DB::raw('total_amount - paid_amount'));
        
        // Current cash balance = Total Sales - Total Purchases + Outstanding Payables - Outstanding Receivables
        $currentCashBalance = $totalSales - $totalPurchases + $outstandingPayables - $outstandingReceivables;

        return [
            'currentBalance' => (float) $currentCashBalance,
            'totalSales' => (float) $totalSales,
            'totalPurchases' => (float) $totalPurchases,
            'outstandingReceivables' => (float) $outstandingReceivables,
            'outstandingPayables' => (float) $outstandingPayables,
        ];
    }
}