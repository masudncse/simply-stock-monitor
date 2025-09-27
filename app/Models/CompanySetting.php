<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class CompanySetting extends Model
{
    protected $table = 'company_settings';
    
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
        $settings = static::first();
        
        if ($settings) {
            $settings->update($data);
        } else {
            $settings = static::create($data);
        }
                
        return $settings;
    }
}
