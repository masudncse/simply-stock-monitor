<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'contact_person',
        'phone',
        'email',
        'address',
        'tax_number',
        'default_tax_rate',
        'credit_limit',
        'outstanding_amount',
        'is_active',
    ];

    protected $casts = [
        'default_tax_rate' => 'float',
        'credit_limit' => 'float',
        'outstanding_amount' => 'float',
        'is_active' => 'boolean',
    ];

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'reference_id')
            ->where('reference_type', 'supplier');
    }
}
