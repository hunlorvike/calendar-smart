'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
    const { login, isLoading } = useAuth();

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <AuthForm type="login" onSubmit={login} isLoading={isLoading} />
        </div>
    );
}
