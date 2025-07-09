<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price',
        'amenities',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }

}

