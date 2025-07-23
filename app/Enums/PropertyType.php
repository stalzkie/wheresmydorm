<?php

namespace App\Enums;

enum PropertyType: string
{
    case DORMITORY = 'dormitory';
    case APARTMENT = 'apartment';
    case BEDSPACE = 'bedspace';
    case HOMESTAY = 'homestay';

    /**
     * Get all property type values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get display name for the property type
     */
    public function getDisplayName(): string
    {
        return match ($this) {
            self::DORMITORY => 'Dormitory',
            self::APARTMENT => 'Apartment',
            self::BEDSPACE => 'Bed Space',
            self::HOMESTAY => 'Homestay',
        };
    }
}
