'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TaskItemProps } from '@/types/task';
import { PRIORITY_CONFIG } from '@/types/calendar';

export const TaskItem = memo(function TaskItem({
    task,
    onEdit,
    onDelete,
}: TaskItemProps) {
    const priorityConfig = PRIORITY_CONFIG[task.priority];

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                {format(new Date(task.startTime), 'PPp')}
                            </span>
                            <span>•</span>
                            <span>{task.duration} mins</span>
                            <span>•</span>
                            <span className={priorityConfig.color}>
                                {task.priority.toLowerCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(task)}
                        >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit task</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                        >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete task</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
