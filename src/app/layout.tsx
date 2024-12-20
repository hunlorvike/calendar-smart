import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Smart Calendar',
    description: 'Manage your time efficiently',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <div className="min-h-screen">
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <Toaster />
                </div>
            </body>
        </html>
    );
}
