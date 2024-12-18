import prisma from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Username and password are required',
            };
            return new Response(JSON.stringify(response), { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Username already exists',
            };
            return new Response(JSON.stringify(response), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        const response: ApiResponse<typeof user> = {
            success: true,
            message: 'User registered successfully',
            data: user,
        };

        return new Response(JSON.stringify(response), { status: 201 });
    } catch (error) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}
