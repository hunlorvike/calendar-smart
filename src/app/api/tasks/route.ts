import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    startTime: z.string().transform((str) => new Date(str)),
    duration: z.number().min(1),
    repeat: z.number().min(0),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '5');
        const all = searchParams.get('all') === 'true';

        const where = { userId: session.user.id };
        const [tasks, totalCount] = await Promise.all([
            prisma.task.findMany({
                where,
                skip: all ? undefined : (page - 1) * pageSize,
                take: all ? undefined : pageSize,
                orderBy: { startTime: 'asc' },
            }),
            prisma.task.count({ where }),
        ]);

        return NextResponse.json({
            message: 'Tasks fetched successfully',
            data: {
                items: tasks,
                totalPages: all ? 1 : Math.ceil(totalCount / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { message: 'An error occurred while fetching tasks' },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            );
        }

        const body = await req.json();
        const taskData = taskSchema.parse(body);

        const task = await prisma.task.create({
            data: {
                ...taskData,
                userId: session.user.id,
            },
        });

        return NextResponse.json({
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { message: 'An error occurred while creating the task' },
            { status: 500 },
        );
    }
}
