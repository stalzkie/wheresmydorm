export interface DormPost {
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
    amenities: string[];
    created_at: string;
    thumbnail?: string;
}

export interface Transaction {
    id: number;
    student_name: string;
    post_id: number;
    amount: number;
    status: 'active' | 'completed' | 'pending';
}

export interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    body: string;
    sent_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'dorm' | 'admin' | 'student'; // Optional: restrict to known roles
}
