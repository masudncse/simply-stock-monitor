<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Courier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'branch',
        'code',
        'contact_person',
        'phone',
        'email',
        'website',
        'address',
        'base_rate',
        'per_kg_rate',
        'coverage_areas',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'base_rate' => 'float',
        'per_kg_rate' => 'float',
        'is_active' => 'boolean',
    ];

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    /**
     * Calculate shipping cost based on weight
     */
    public function calculateShippingCost(float $weight): float
    {
        return $this->base_rate + ($weight * $this->per_kg_rate);
    }
}
