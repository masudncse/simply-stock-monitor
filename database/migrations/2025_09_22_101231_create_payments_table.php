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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_number')->unique();
            $table->enum('voucher_type', ['receipt', 'payment']);
            $table->date('payment_date');
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->string('reference_type')->nullable(); // purchase, sale, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['cash', 'bank_transfer', 'cheque', 'card', 'other']);
            $table->string('reference_number')->nullable(); // cheque number, transaction id, etc.
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
