<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'return_number',
        'purchase_id',
        'supplier_id',
        'warehouse_id',
        'return_date',
        'subtotal',
        'tax_amount',
        'total_amount',
        'status',
        'reason',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'purchase_id' => 'integer',
        'supplier_id' => 'integer',
        'warehouse_id' => 'integer',
        'return_date' => 'date',
        'subtotal' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
