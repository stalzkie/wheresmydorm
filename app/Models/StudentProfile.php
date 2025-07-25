<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_name',
        'age',
        'address',
        'guardian_name',
        'guardian_contact_no',
    ];

    public function user(): BelongsTo 
    {
        return $this->belongsTo(User::class);
    }
}
