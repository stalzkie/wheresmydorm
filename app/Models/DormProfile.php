<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DormProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        'user_id',
        'establishment_name',
        'description',
        'establishment_address',
        'zip_code',
        'contact_email',
        'cover_photo_path',
        'property_type',
        'gender_policy',
        'has_wifi',
        'has_ac',
        'has_laundry',
        'has_cctv',
        'allows_cooking',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
