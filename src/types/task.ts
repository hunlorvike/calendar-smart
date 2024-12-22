import { Task, Priority } from '@prisma/client';

export interface TaskFormData {
    title: string;
    description: string;
    startTime: string;
    duration: number;
    repeat: number;
    priority: Priority;
}

export interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'view' | 'edit' | 'create';
    task?: Task | null;
    onSave?: (task: TaskFormData) => Promise<void>;
}

export interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

export interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}
