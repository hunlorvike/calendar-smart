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
import { Task } from '@prisma/client';
import { format } from 'date-fns';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    onSave: (task: Omit<Task, 'id'> & Partial<Pick<Task, 'id'>>) => void;
}

export function TaskModal({ isOpen, onClose, task, onSave }: TaskModalProps) {
    const [formData, setFormData] = useState<Omit<Task, 'id'>>({
        title: '',
        description: '',
        startTime: new Date(),
        duration: 0,
        repeat: 0,
        priority: 'MEDIUM',
        userId: 0,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                startTime: new Date(task.startTime),
                duration: task.duration,
                repeat: task.repeat,
                priority: task.priority,
                userId: task.userId,
            });
        } else {
            resetForm();
        }
    }, [task]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            startTime: new Date(),
            duration: 0,
            repeat: 0,
            priority: 'MEDIUM',
            userId: 0,
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const date = new Date(value);
        setFormData((prev) => ({ ...prev, [name]: date }));
    };

    const handlePriorityChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            priority: value as Task['priority'],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            duration: Number(formData.duration),
            repeat: Number(formData.repeat),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {task ? 'Edit Task' : 'Create Task'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                name="startTime"
                                value={format(
                                    formData.startTime,
                                    "yyyy-MM-dd'T'HH:mm",
                                )}
                                onChange={handleDateTimeChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="duration">
                                Duration (in minutes)
                            </Label>
                            <Input
                                id="duration"
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="repeat">Repeat (in mins)</Label>
                            <Input
                                id="repeat"
                                type="number"
                                name="repeat"
                                value={formData.repeat}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={handlePriorityChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
