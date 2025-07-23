<?php

namespace App\DTOs\Auth;

class DormProfileData
{
    public function __construct(
        public readonly string $establishment_name,
        public readonly string $establishment_address,
        public readonly string $zip_code,
        public readonly ?string $description = null,
        public readonly ?string $contact_email = null,
        public readonly ?string $cover_photo_path = null,
        public readonly string $property_type = 'dormitory',
        public readonly string $gender_policy = 'co-ed',
        public readonly bool $has_wifi = false,
        public readonly bool $has_ac = false,
        public readonly bool $has_laundry = false,
        public readonly bool $has_cctv = false,
        public readonly bool $allows_cooking = false,
    ) {}

    public function toArray(): array
    {
        return [
            'establishment_name' => $this->establishment_name,
            'establishment_address' => $this->establishment_address,
            'zip_code' => $this->zip_code,
            'description' => $this->description,
            'contact_email' => $this->contact_email,
            'cover_photo_path' => $this->cover_photo_path,
            'property_type' => $this->property_type,
            'gender_policy' => $this->gender_policy,
            'has_wifi' => $this->has_wifi,
            'has_ac' => $this->has_ac,
            'has_laundry' => $this->has_laundry,
            'has_cctv' => $this->has_cctv,
            'allows_cooking' => $this->allows_cooking,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            establishment_name: $data['establishment_name'],
            establishment_address: $data['establishment_address'],
            zip_code: $data['zip_code'],
            description: $data['description'] ?? null,
            contact_email: $data['contact_email'] ?? null,
            cover_photo_path: $data['cover_photo_path'] ?? null,
            property_type: $data['property_type'] ?? 'dormitory',
            gender_policy: $data['gender_policy'] ?? 'co-ed',
            has_wifi: $data['has_wifi'] ?? false,
            has_ac: $data['has_ac'] ?? false,
            has_laundry: $data['has_laundry'] ?? false,
            has_cctv: $data['has_cctv'] ?? false,
            allows_cooking: $data['allows_cooking'] ?? false,
        );
    }
}
