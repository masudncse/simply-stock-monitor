<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_number',
        'sale_id',
        'customer_id',
        'courier_service',
        'tracking_number',
        'shipping_date',
        'expected_delivery_date',
        'actual_delivery_date',
        'status',
        'recipient_name',
        'recipient_phone',
        'recipient_address',
        'recipient_city',
        'recipient_district',
        'recipient_postal_code',
        'number_of_packages',
        'total_weight',
        'package_dimensions',
        'shipping_cost',
        'is_paid',
        'notes',
        'special_instructions',
        'created_by',
    ];

    protected $casts = [
        'shipping_date' => 'date',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'shipping_cost' => 'float',
        'total_weight' => 'float',
        'is_paid' => 'boolean',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Generate unique shipment number
     */
    public static function generateShipmentNumber(): string
    {
        $lastShipment = self::latest('id')->first();
        $nextNumber = $lastShipment ? ($lastShipment->id + 1) : 1;
        return 'SHP-' . date('Ymd') . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}

