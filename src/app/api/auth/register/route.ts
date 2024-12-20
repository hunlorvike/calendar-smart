import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createApiResponse } from '@/lib/types';

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

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return createApiResponse(null, 'Username already exists.', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
            select: {
                id: true,
                username: true,
            },
        });

        return createApiResponse(user, 'User registered successfully.', 201);
    } catch (error) {
        console.error('Registration error:', error);
        return createApiResponse(
            null,
            'An error occurred during registration.',
            500,
        );
    }
}
