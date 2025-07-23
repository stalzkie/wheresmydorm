<?php

namespace App\DTOs\Auth;

class StudentProfileData
{
    public function __construct(
        public readonly string $school_name,
        public readonly ?int $age = null,
        public readonly ?string $address = null,
        public readonly ?string $guardian_name = null,
        public readonly ?string $guardian_contact_no = null,
    ) {}

    public function toArray(): array
    {
        return [
            'school_name' => $this->school_name,
            'age' => $this->age,
            'address' => $this->address,
            'guardian_name' => $this->guardian_name,
            'guardian_contact_no' => $this->guardian_contact_no,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            school_name: $data['school_name'],
            age: $data['age'] ?? null,
            address: $data['address'] ?? null,
            guardian_name: $data['guardian_name'] ?? null,
            guardian_contact_no: $data['guardian_contact_no'] ?? null,
        );
    }
}
