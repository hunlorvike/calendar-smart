'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, ListTodo } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
    { href: '/', label: 'Tasks', icon: <ListTodo className="h-5 w-5 mr-2" /> },
    {
        href: '/calendar',
        label: 'Calendar',
        icon: <Calendar className="h-5 w-5 mr-2" />,
    },
];

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <nav className="flex items-center space-x-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors flex items-center space-x-2 hover:text-primary ${
                                pathname === item.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
                {session ? (
                    <Button variant="ghost" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                )}{' '}
            </div>
        </header>
    );
}
