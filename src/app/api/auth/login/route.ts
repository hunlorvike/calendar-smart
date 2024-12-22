import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        return NextResponse.json({
            message: 'Login successful',
            data: { token },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'An error occurred during login' },
            { status: 500 },
        );
    }
}
