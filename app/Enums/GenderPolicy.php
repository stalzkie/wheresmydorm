<?php

namespace App\Enums;

enum GenderPolicy: string
{
    case CO_ED = 'co-ed';
    case MALE_ONLY = 'male_only';
    case FEMALE_ONLY = 'female_only';

    /**
     * Get all gender policy values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get display name for the gender policy
     */
    public function getDisplayName(): string
    {
        return match ($this) {
            self::CO_ED => 'Co-ed',
            self::MALE_ONLY => 'Male Only',
            self::FEMALE_ONLY => 'Female Only',
        };
    }
}
