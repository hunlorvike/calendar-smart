import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createApiResponse } from '@/lib/types';
import { createToken } from '@/utils/jwt';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return createApiResponse(
                null,
                'Username and password are required.',
                400,
            );
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return createApiResponse(null, 'Invalid credentials.', 401);
        }

        const token = createToken(user.id, user.username);
        return createApiResponse({ token }, 'Login successful.', 200);
    } catch (error) {
        console.error('Login error:', error);
        return createApiResponse(null, 'An error occurred during login.', 500);
    }
}
