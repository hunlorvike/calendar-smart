'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ListTodo, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 lg:px-8">
                <nav className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary hover:scale-105 
                            px-3 py-2 rounded-md hover:bg-primary/10 ${
                                pathname === '/'
                                    ? 'bg-gray-100'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            <ListTodo className="h-5 w-5" />
                            <span>Tasks</span>
                        </Link>
                        <Link
                            href="/calendar"
                            className={`flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary hover:scale-105
                            px-3 py-2 rounded-md hover:bg-primary/10 ${
                                pathname === '/calendar'
                                    ? 'bg-gray-100'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Calendar</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className={`flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary hover:scale-105
                            px-3 py-2 rounded-md hover:bg-primary/10 ${
                                pathname === '/login'
                                    ? 'bg-gray-100'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            <LogIn className="h-5 w-5" />
                            <span>Login</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
