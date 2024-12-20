import { Task } from '@prisma/client';

export interface EventWithConflict
    extends Pick<Task, 'title' | 'description' | 'priority'> {
    id: string;
    start: string;
    end: string;
    backgroundColor: string;
    display: 'block';
    isOverlapping: boolean;
    overlappingWith: {
        id: string;
        title: string;
        start: Date;
        end: Date;
    }[];
    task: Task;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
