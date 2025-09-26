<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'tax_id',
        'website',
        'logo',
    ];

    public static function getSettings()
    {
        return static::first() ?? new static();
    }

    public static function updateSettings(array $data)
    {
        \Log::info('CompanySetting::updateSettings called with data:', $data);
        
        $settings = static::first();
        
        if ($settings) {
            \Log::info('Updating existing settings with ID:', $settings->id);
            $settings->update($data);
        } else {
            \Log::info('Creating new settings record');
            $settings = static::create($data);
        }
        
        \Log::info('Settings after save:', $settings->toArray());
        
        return $settings;
    }
}
