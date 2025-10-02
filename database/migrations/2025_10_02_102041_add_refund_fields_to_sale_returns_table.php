<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sale_returns', function (Blueprint $table) {
            $table->enum('refund_status', ['pending', 'completed', 'not_required'])->default('pending')->after('status');
            $table->enum('refund_method', ['cash', 'bank', 'credit_account'])->nullable()->after('refund_status');
            $table->date('refund_date')->nullable()->after('refund_method');
            $table->decimal('refunded_amount', 15, 2)->default(0)->after('refund_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_returns', function (Blueprint $table) {
            $table->dropColumn(['refund_status', 'refund_method', 'refund_date', 'refunded_amount']);
        });
    }
};
