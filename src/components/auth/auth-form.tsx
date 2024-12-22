'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const authFormSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authFormSchema>;

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (data: AuthFormData) => Promise<void>;
    isLoading: boolean;
}

export const AuthForm = memo(function AuthForm({
    type,
    onSubmit,
    isLoading,
}: AuthFormProps) {
    const form = useForm<AuthFormData>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = form.handleSubmit(onSubmit);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{type === 'login' ? 'Login' : 'Register'}</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your username"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder={
                                                type === 'login'
                                                    ? 'Enter your password'
                                                    : 'Create a password'
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Loading...'
                                : type === 'login'
                                  ? 'Login'
                                  : 'Register'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            {type === 'login'
                                ? "Don't have an account? "
                                : 'Already have an account? '}
                            <Link
                                href={type === 'login' ? '/register' : '/login'}
                                className="text-primary underline"
                            >
                                {type === 'login' ? 'Register' : 'Login'}
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
});
