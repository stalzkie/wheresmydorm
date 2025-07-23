<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case STUDENT = 'student';
    case DORM = 'dorm';

    /**
     * Get all role values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the dashboard route for this role
     */
    public function getDashboardRoute(): string
    {
        return match ($this) {
            self::ADMIN => 'admin.dashboard',
            self::STUDENT => 'student.dashboard',
            self::DORM => 'dorm.dashboard',
        };
    }

    /**
     * Check if this role requires a profile
     */
    public function requiresProfile(): bool
    {
        return match ($this) {
            self::ADMIN => false,
            self::STUDENT, self::DORM => true,
        };
    }
}
