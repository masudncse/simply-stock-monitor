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

Route::get('/', function () {
    return Inertia::render('welcome');
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
    Route::resource('sales', SaleController::class);
    Route::post('sales/{sale}/process', [SaleController::class, 'process'])->name('sales.process');
    
    // Customers
    Route::resource('customers', CustomerController::class);
    
    // Suppliers
    Route::resource('suppliers', SupplierController::class);
    
    // POS
    Route::get('pos', [POSController::class, 'index'])->name('pos.index');
    Route::post('sales', [POSController::class, 'processSale'])->name('pos.process-sale');
    Route::get('pos/search-products', [POSController::class, 'searchProducts'])->name('pos.search-products');
    Route::get('pos/product-by-barcode', [POSController::class, 'getProductByBarcode'])->name('pos.product-by-barcode');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
