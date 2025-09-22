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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'income', 'expense']);
            $table->enum('sub_type', ['current_asset', 'fixed_asset', 'current_liability', 'long_term_liability', 'owner_equity', 'revenue', 'cost_of_goods_sold', 'operating_expense', 'other_expense'])->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('accounts')->onDelete('cascade');
            $table->decimal('opening_balance', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
