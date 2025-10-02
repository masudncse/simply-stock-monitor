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
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\WarehouseController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Products
    Route::resource('products', ProductController::class);
    Route::get('products-api', [ProductController::class, 'getProducts'])->name('products.api');
    Route::get('categories-api/search', [ProductController::class, 'searchCategories'])->name('categories.search');
    Route::get('products-api/search', [ProductController::class, 'searchProducts'])->name('products.search');
    Route::delete('product-images/{productImage}', [ProductController::class, 'deleteImage'])->name('products.images.delete');
    Route::patch('product-images/{productImage}/set-primary', [ProductController::class, 'setPrimaryImage'])->name('products.images.set-primary');
    
    // Warehouses
    Route::resource('warehouses', WarehouseController::class);
    
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
    Route::post('sales/{sale}/approve', [SaleController::class, 'approve'])->name('sales.approve');
    Route::post('sales/{sale}/process', [SaleController::class, 'process'])->name('sales.process');
    
    // Quotations
    Route::resource('quotations', QuotationController::class);
    Route::post('quotations/{quotation}/approve', [QuotationController::class, 'approve'])->name('quotations.approve');
    Route::post('quotations/{quotation}/reject', [QuotationController::class, 'reject'])->name('quotations.reject');
    Route::post('quotations/{quotation}/send', [QuotationController::class, 'send'])->name('quotations.send');
    Route::post('quotations/{quotation}/convert-to-sale', [QuotationController::class, 'convertToSale'])->name('quotations.convert-to-sale');
    
    // Print Routes
    Route::get('sales/{sale}/print', [SaleController::class, 'print'])->name('sales.print');
    Route::get('purchases/{purchase}/print', [PurchaseController::class, 'print'])->name('purchases.print');
    Route::get('quotations/{quotation}/print', [QuotationController::class, 'print'])->name('quotations.print');
    
    // Customers
    Route::resource('customers', CustomerController::class);
    Route::get('customers-api/search', [CustomerController::class, 'searchCustomers'])->name('customers.search');
    
    // Suppliers
    Route::resource('suppliers', SupplierController::class);
    Route::get('suppliers-api/search', [SupplierController::class, 'searchSuppliers'])->name('suppliers.search');
    
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
        
        // Settings - handled by settings.php routes
        
        // User Management
        Route::resource('users', UserController::class);
        
        // Role Management
        Route::resource('roles', RoleController::class);
        
        // Permission Management
        Route::resource('permissions', PermissionController::class);
        // Backup routes handled by settings.php
        
        // POS
        Route::get('pos', [POSController::class, 'index'])->name('pos.index');
        Route::post('sales', [POSController::class, 'processSale'])->name('pos.process-sale');
        Route::get('pos/search-products', [POSController::class, 'searchProducts'])->name('pos.search-products');
        Route::get('pos/product-by-barcode', [POSController::class, 'getProductByBarcode'])->name('pos.product-by-barcode');
        
        // Notifications
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::delete('notifications/{notification}', [NotificationController::class, 'delete'])->name('notifications.delete');
        Route::get('notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
