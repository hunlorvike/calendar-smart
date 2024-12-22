'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
    const { register, isLoading } = useAuth();

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <AuthForm
                type="register"
                onSubmit={register}
                isLoading={isLoading}
            />
        </div>
    );
}
