'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/utils/axios';

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/register', {
                username: username.trim(),
                password: password.trim(),
            });

            toast({
                description: response.data.message,
                duration: 3000,
            });

            router.push('/login');
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || 'Something went wrong';

            toast({
                description: errorMessage,
                variant: 'destructive',
                duration: 3000,
            });
        }
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-primary underline"
                            >
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}