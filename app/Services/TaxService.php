<?php

namespace App\Services;

use App\Models\SystemSetting;

class TaxService
{
    /**
     * Get the current tax rate from system settings
     */
    public static function getTaxRate(): float
    {
        $taxRate = SystemSetting::get('default_tax_rate', 10);
        return (float) $taxRate;
    }

    /**
     * Calculate tax amount based on subtotal
     */
    public static function calculateTaxAmount(float $subtotal): float
    {
        $taxRate = self::getTaxRate();
        return ($subtotal * $taxRate) / 100;
    }

    /**
     * Get tax rate as percentage string
     */
    public static function getTaxRatePercentage(): string
    {
        return self::getTaxRate() . '%';
    }
}
