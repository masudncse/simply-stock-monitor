<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
