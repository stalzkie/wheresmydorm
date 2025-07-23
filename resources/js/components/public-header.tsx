import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';

interface PublicHeaderProps {
    className?: string;
}

export function PublicHeader({ className = '' }: PublicHeaderProps) {
    return (
        <header className={`flex w-full items-center justify-between px-6 py-4 ${className}`}>
            <Link href="/" className="flex items-center space-x-2">
                <AppLogo />
            </Link>
            
            <nav className="flex items-center gap-4">
                <Link href={route('login')}>
                    <Button variant="ghost" size="sm">
                        Log in
                    </Button>
                </Link>
                <Link href={route('register')}>
                    <Button size="sm">
                        Register
                    </Button>
                </Link>
            </nav>
        </header>
    );
}
