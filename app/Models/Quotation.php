<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_number',
        'customer_id',
        'warehouse_id',
        'quotation_date',
        'valid_until',
        'notes',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'discount_type',
        'discount_value',
        'total_amount',
        'status',
        'created_by',
        'approved_by',
        'approved_at',
        'converted_to_sale_id',
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'warehouse_id' => 'integer',
        'quotation_date' => 'date',
        'valid_until' => 'date',
        'approved_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'converted_to_sale_id' => 'integer',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function convertedSale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'converted_to_sale_id');
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'draft' => 'secondary',
            'sent' => 'primary',
            'approved' => 'success',
            'rejected' => 'destructive',
            'expired' => 'outline',
            default => 'secondary',
        };
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isExpired(): bool
    {
        return $this->valid_until < now()->toDateString();
    }

    public function canBeConvertedToSale(): bool
    {
        return $this->isApproved() && !$this->isExpired() && !$this->converted_to_sale_id;
    }
}
