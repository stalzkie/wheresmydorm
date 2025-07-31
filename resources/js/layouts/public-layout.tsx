import { PublicHeader } from '@/components/public-header';
import { type PropsWithChildren } from 'react';

interface PublicLayoutProps {
    className?: string;
}

export default function PublicLayout({ children, className = '' }: PropsWithChildren<PublicLayoutProps>) {
    return (
        <div className={`flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${className}`}>
            <PublicHeader />
            <main className="flex-1">{children}</main>
        </div>
    );
}
