<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dorm_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Dorm Info
            $table->string('establishment_name');
            $table->text('description')->nullable();
            $table->string('establishment_address');
            $table->string('zip_code');
            $table->string('contact_email');
            $table->string('cover_photo_path')->nullable();

            // Property Details
            $table->enum('property_type', ['dormitory', 'apartment', 'bedspace', 'homestay']);
            $table->enum('gender_policy', ['co-ed', 'male_only', 'female_only']);


            // Amenities
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_ac')->default(false);
            $table->boolean('has_laundry')->default(false);
            $table->boolean('has_cctv')->default(false);
            $table->boolean('allows_cooking')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dorm_profiles');
    }
};
