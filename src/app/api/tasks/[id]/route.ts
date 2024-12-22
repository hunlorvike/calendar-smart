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

export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            );
        }

        const taskId = parseInt(params.id);
        const body = await req.json();
        const taskData = taskSchema.parse(body);

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 },
            );
        }

        if (task.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 },
            );
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: taskData,
        });

        return NextResponse.json({
            message: 'Task updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { message: 'An error occurred while updating the task' },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            );
        }

        const taskId = parseInt(params.id);

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 },
            );
        }

        if (task.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 },
            );
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { message: 'An error occurred while deleting the task' },
            { status: 500 },
        );
    }
}
