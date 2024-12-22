import { memo } from 'react';
import { Task } from '@prisma/client';
import { TaskItem } from './task-item';
import { TaskListProps } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

export const TaskList = memo(function TaskList({
    tasks,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
}: TaskListProps & {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Tasks</CardTitle>
                    <Button
                        onClick={() => onEdit({} as Task)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Create Task
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No tasks found
                        </div>
                    )}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    className="mt-4"
                />
            </CardContent>
        </Card>
    );
});
