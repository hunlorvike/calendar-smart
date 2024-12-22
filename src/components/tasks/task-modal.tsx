'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Priority } from '@prisma/client';
import { TaskModalProps, TaskFormData } from '@/types/task';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn-utils';
import { DateTimePicker24h } from '../ui/datetime-picker';

const taskFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    startTime: z.string().min(1, 'Start time is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    repeat: z.number().min(0, 'Repeat must be 0 or greater'),
    priority: z.nativeEnum(Priority),
});

export function TaskModal({
    isOpen,
    onClose,
    mode,
    task,
    onSave,
}: TaskModalProps) {
    const isViewMode = mode === 'view';

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: new Date()
                .toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
                .slice(0, 16),
            duration: 0,
            repeat: 0,
            priority: Priority.MEDIUM,
        },
    });

    useEffect(() => {
        if (task && (mode === 'edit' || mode === 'view')) {
            form.reset({
                title: task.title,
                description: task.description,
                startTime: task.startTime
                    ? new Date(task.startTime)
                          .toLocaleString('en-US', {
                              timeZone: 'Asia/Ho_Chi_Minh',
                          })
                          .slice(0, 16)
                    : new Date()
                          .toLocaleString('en-US', {
                              timeZone: 'Asia/Ho_Chi_Minh',
                          })
                          .slice(0, 16),
                duration: task.duration,
                repeat: task.repeat,
                priority: task.priority,
            });
        } else if (mode === 'create') {
            form.reset({
                title: '',
                description: '',
                startTime: new Date()
                    .toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
                    .slice(0, 16),
                duration: 0,
                repeat: 0,
                priority: Priority.MEDIUM,
            });
        }
    }, [task, mode, form]);

    const handleSubmit = async (data: TaskFormData) => {
        if (onSave && (mode === 'edit' || mode === 'create')) {
            await onSave(data);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view'
                            ? 'View Task'
                            : mode === 'edit'
                              ? 'Edit Task'
                              : 'Create Task'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isViewMode}
                                            className={cn(
                                                fieldState.error &&
                                                    'border-red-500 focus-visible:ring-red-500',
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={isViewMode}
                                            className={cn(
                                                fieldState.error &&
                                                    'border-red-500 focus-visible:ring-red-500',
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker24h
                                            onChange={(newDate) =>
                                                field.onChange(
                                                    newDate?.toISOString(),
                                                )
                                            }
                                            defaultDate={new Date(field.value)}
                                            disabled={isViewMode}
                                            
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            disabled={isViewMode}
                                            className={cn(
                                                fieldState.error &&
                                                    'border-red-500 focus-visible:ring-red-500',
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repeat"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Repeat (minutes)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            disabled={isViewMode}
                                            className={cn(
                                                fieldState.error &&
                                                    'border-red-500 focus-visible:ring-red-500',
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isViewMode}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={cn(
                                                    fieldState.error &&
                                                        'border-red-500 focus-visible:ring-red-500',
                                                )}
                                            >
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Priority).map(
                                                (priority) => (
                                                    <SelectItem
                                                        key={priority}
                                                        value={priority}
                                                    >
                                                        {priority.toLowerCase()}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                        {mode !== 'view' && (
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {mode === 'edit' ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
