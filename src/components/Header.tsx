'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ListTodo, LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 lg:px-8">
                <nav className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:text-primary px-3 py-2 rounded-md ${
                                pathname === '/'
                                    ? 'bg-gray-100 text-black'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            <ListTodo className="h-5 w-5" />
                            <span>Tasks</span>
                        </Link>
                        <Link
                            href="/calendar"
                            className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:text-primary px-3 py-2 rounded-md ${
                                pathname === '/calendar'
                                    ? 'bg-gray-100 text-black'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Calendar</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {token !== null ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:text-primary px-3 py-2 rounded-md"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:text-primary px-3 py-2 rounded-md ${
                                    pathname === '/login'
                                        ? 'bg-gray-100 text-black'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                <LogIn className="h-5 w-5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
