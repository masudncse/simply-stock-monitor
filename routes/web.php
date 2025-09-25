<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Products
    Route::resource('products', ProductController::class);
    Route::get('products-api', [ProductController::class, 'getProducts'])->name('products.api');
    
    // Stock
    Route::resource('stock', StockController::class)->only(['index']);
    Route::get('stock/low-stock', [StockController::class, 'lowStock'])->name('stock.low-stock');
    Route::get('stock/adjust', [StockController::class, 'adjust'])->name('stock.adjust');
    Route::post('stock/adjust', [StockController::class, 'processAdjustment'])->name('stock.adjust.process');
    Route::get('stock/transfer', [StockController::class, 'transfer'])->name('stock.transfer');
    Route::post('stock/transfer', [StockController::class, 'processTransfer'])->name('stock.transfer.process');
    Route::get('stock/product-stock', [StockController::class, 'getProductStock'])->name('stock.product-stock');
    Route::get('stock/history', [StockController::class, 'getStockHistory'])->name('stock.history');
    
    // Purchases
    Route::resource('purchases', PurchaseController::class);
    Route::post('purchases/{purchase}/approve', [PurchaseController::class, 'approve'])->name('purchases.approve');
    
    // Sales
    Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::get('sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::get('sales/{sale}/edit', [SaleController::class, 'edit'])->name('sales.edit');
    Route::put('sales/{sale}', [SaleController::class, 'update'])->name('sales.update');
    Route::delete('sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
    Route::post('sales/{sale}/process', [SaleController::class, 'process'])->name('sales.process');
    
    // Customers
    Route::resource('customers', CustomerController::class);
    
    // Suppliers
    Route::resource('suppliers', SupplierController::class);
    
    // Accounts
    Route::resource('accounts', AccountController::class);
    Route::get('accounts/trial-balance', [AccountController::class, 'trialBalance'])->name('accounts.trial-balance');
    
    // Payments
    Route::resource('payments', PaymentController::class);
    
        // Expenses
        Route::resource('expenses', ExpenseController::class);
        
        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/stock', [ReportController::class, 'stockReport'])->name('reports.stock');
        Route::get('reports/sales', [ReportController::class, 'salesReport'])->name('reports.sales');
        Route::get('reports/purchases', [ReportController::class, 'purchaseReport'])->name('reports.purchases');
        Route::get('reports/profit-loss', [ReportController::class, 'profitLossReport'])->name('reports.profit-loss');
        Route::get('reports/customer-outstanding', [ReportController::class, 'customerOutstandingReport'])->name('reports.customer-outstanding');
        Route::get('reports/supplier-outstanding', [ReportController::class, 'supplierOutstandingReport'])->name('reports.supplier-outstanding');
        Route::post('reports/export', [ReportController::class, 'exportReport'])->name('reports.export');
        
        // Settings
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::get('settings/company', [SettingsController::class, 'company'])->name('settings.company');
        Route::post('settings/company', [SettingsController::class, 'updateCompany'])->name('settings.company.update');
        Route::get('settings/system', [SettingsController::class, 'system'])->name('settings.system');
        Route::post('settings/system', [SettingsController::class, 'updateSystem'])->name('settings.system.update');
        Route::get('settings/users', [SettingsController::class, 'users'])->name('settings.users');
        Route::get('settings/roles', [SettingsController::class, 'roles'])->name('settings.roles');
        
        // User Management
        Route::resource('users', UserController::class);
        
        // Role Management
        Route::resource('roles', RoleController::class);
        
        // Permission Management
        Route::resource('permissions', PermissionController::class);
        Route::get('settings/backup', [SettingsController::class, 'backup'])->name('settings.backup');
        Route::post('settings/backup', [SettingsController::class, 'createBackup'])->name('settings.backup.create');
        
        // POS
        Route::get('pos', [POSController::class, 'index'])->name('pos.index');
        Route::post('sales', [POSController::class, 'processSale'])->name('pos.process-sale');
        Route::get('pos/search-products', [POSController::class, 'searchProducts'])->name('pos.search-products');
        Route::get('pos/product-by-barcode', [POSController::class, 'getProductByBarcode'])->name('pos.product-by-barcode');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
