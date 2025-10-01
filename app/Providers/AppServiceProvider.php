<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Stock;
use App\Observers\StockObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers
        Stock::observe(StockObserver::class);
    }
}
