'use client';

import { useState } from 'react';
import {
    signIn,
    signOut as nextAuthSignOut,
    useSession,
} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { AuthFormData } from '@/types/auth';

export function useAuth() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (data: AuthFormData) => {
        try {
            setIsLoading(true);
            const result = await signIn('credentials', {
                username: data.username,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: 'Error',
                    description: 'Invalid credentials',
                    variant: 'destructive',
                    duration: 3000,
                });
            } else {
                toast({
                    title: 'Success',
                    description: 'Logged in successfully',
                    duration: 3000,
                });
                router.push('/');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred during login',
                variant: 'destructive',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: AuthFormData) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Registered successfully',
                    duration: 3000,
                });
                router.push('/login');
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Error',
                    description: errorData.message || 'Registration failed',
                    variant: 'destructive',
                    duration: 3000,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred during registration',
                variant: 'destructive',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await nextAuthSignOut({ redirect: false });
            await update();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast({
                title: 'Error',
                description: 'An error occurred during logout',
                variant: 'destructive',
                duration: 3000,
            });
        }
    };

    return {
        isLoading,
        login,
        register,
        logout,
        session,
        status,
    };
}
