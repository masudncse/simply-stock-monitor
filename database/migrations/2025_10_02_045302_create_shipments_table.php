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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('shipment_number')->unique();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('courier_service'); // SA Poribahan, Sundorbon Express, FedEx, DHL, Pathao, etc.
            $table->string('tracking_number')->nullable();
            $table->date('shipping_date');
            $table->date('expected_delivery_date')->nullable();
            $table->date('actual_delivery_date')->nullable();
            $table->enum('status', ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned'])->default('pending');
            
            // Recipient details
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('recipient_address');
            $table->string('recipient_city')->nullable();
            $table->string('recipient_district')->nullable();
            $table->string('recipient_postal_code')->nullable();
            
            // Package details
            $table->integer('number_of_packages')->default(1);
            $table->decimal('total_weight', 10, 2)->nullable(); // in kg
            $table->string('package_dimensions')->nullable(); // L x W x H
            
            // Costs
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->boolean('is_paid')->default(false);
            
            // Additional info
            $table->text('notes')->nullable();
            $table->text('special_instructions')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes
            $table->index('shipment_number');
            $table->index('tracking_number');
            $table->index('status');
            $table->index('shipping_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
