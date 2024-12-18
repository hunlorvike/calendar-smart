'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Task } from '@/lib/types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    onSave: (task: Task) => void;
}

export function TaskModal({
    isOpen,
    onClose,
    task = null,
    onSave,
}: TaskModalProps) {
    const [formData, setFormData] = useState<Omit<Task, 'id'>>({
        title: '',
        description: '',
        startTime: '',
        duration: 0,
        repeat: 0,
        priority: 'medium',
    });

    useEffect(() => {
        if (isOpen && task) {
            setFormData({
                title: task.title,
                description: task.description,
                startTime: new Date(task.startTime).toISOString().slice(0, 16),
                duration: task.duration,
                repeat: task.repeat,
                priority: task.priority,
            });
        } else if (!isOpen) {
            setFormData({
                title: '',
                description: '',
                startTime: '',
                duration: 0,
                repeat: 0,
                priority: 'medium',
            });
        }
    }, [isOpen, task]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData: Task = {
            id: task?.id ?? Date.now(),
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            duration: Number(formData.duration),
            repeat: Number(formData.repeat),
        };

        onSave(taskData);
        onClose();
    };
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] border shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
                        {task ? 'Edit Task' : 'Create Task'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            className="min-h-[100px]"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repeat">Repeat (minutes)</Label>
                        <Input
                            id="repeat"
                            name="repeat"
                            type="number"
                            value={formData.repeat}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            name="priority"
                            value={formData.priority}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    priority: value as
                                        | 'high'
                                        | 'medium'
                                        | 'low',
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full" type="submit">
                        {task ? 'Update' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
