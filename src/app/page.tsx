'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TaskModal } from '@/components/TaskModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Task } from '@prisma/client';
import axiosInstance from '@/utils/axios';

export default function Home() {
    const [state, setState] = useState({
        isModalOpen: false,
        editingTask: null as Task | null,
        tasks: [] as Task[],
        currentPage: 1,
        totalPages: 1,
        taskToDelete: null as number | null,
        isLoading: true,
    });
    const itemsPerPage = 5;

    const fetchTasks = async () => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));
            const response = await axiosInstance.get('/tasks', {
                params: { page: state.currentPage, pageSize: itemsPerPage },
            });
            setState((prev) => ({
                ...prev,
                tasks: response.data.data.items,
                totalPages: response.data.data.totalPages,
            }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [state.currentPage]);

    const saveTask = async (
        task: Omit<Task, 'id'> & Partial<Pick<Task, 'id'>>,
    ) => {
        try {
            const response = state.editingTask
                ? await axiosInstance.put(
                      `/tasks/${state.editingTask.id}`,
                      task,
                  )
                : await axiosInstance.post('/tasks', task);
            if ([200, 201].includes(response.status)) {
                fetchTasks();
                setState((prev) => ({
                    ...prev,
                    isModalOpen: false,
                    editingTask: null,
                }));
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const deleteTask = async () => {
        if (!state.taskToDelete) return;
        try {
            const response = await axiosInstance.delete(
                `/tasks/${state.taskToDelete}`,
            );
            if (response.status === 200) {
                fetchTasks();
                setState((prev) => ({
                    ...prev,
                    taskToDelete: null,
                }));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (state.isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Tasks
                            </h1>
                            <Button
                                onClick={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        isModalOpen: true,
                                    }))
                                }
                                variant={'outline'}
                                className="h-9"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Task
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Repeat</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {state.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>{task.title}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    task.startTime,
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {task.duration} mins
                                            </TableCell>
                                            <TableCell>
                                                {task.repeat} mins
                                            </TableCell>
                                            <TableCell>
                                                {task.priority.toLocaleLowerCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    editingTask:
                                                                        task,
                                                                    isModalOpen:
                                                                        true,
                                                                }),
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            setState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    taskToDelete:
                                                                        task.id,
                                                                }),
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious
                                    isActive={state.currentPage === 1}
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            currentPage: Math.max(
                                                prev.currentPage - 1,
                                                1,
                                            ),
                                        }))
                                    }
                                    className="cursor-pointer"
                                />
                                {[...Array(state.totalPages)].map(
                                    (_, index) => (
                                        <PaginationItem key={index + 1}>
                                            <PaginationLink
                                                isActive={
                                                    state.currentPage ===
                                                    index + 1
                                                }
                                                onClick={() =>
                                                    setState((prev) => ({
                                                        ...prev,
                                                        currentPage: index + 1,
                                                    }))
                                                }
                                                className="cursor-pointer"
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ),
                                )}
                                <PaginationNext
                                    isActive={
                                        state.currentPage === state.totalPages
                                    }
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            currentPage: Math.min(
                                                prev.currentPage + 1,
                                                state.totalPages,
                                            ),
                                        }))
                                    }
                                    className="cursor-pointer"
                                />
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>

            <TaskModal
                isOpen={state.isModalOpen}
                onClose={() => {
                    setState((prev) => ({
                        ...prev,
                        isModalOpen: false,
                        editingTask: null,
                    }));
                }}
                task={state.editingTask}
                onSave={saveTask}
            />

            <Dialog
                open={!!state.taskToDelete}
                onOpenChange={() =>
                    setState((prev) => ({ ...prev, taskToDelete: null }))
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setState((prev) => ({
                                    ...prev,
                                    taskToDelete: null,
                                }))
                            }
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteTask}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
