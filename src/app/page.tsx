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
import { Task } from '@/lib/types';
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

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(storedTasks);
    }, []);

    const saveTask = (task: Task) => {
        let updatedTasks: Task[];
        if (editingTask) {
            updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
        } else {
            updatedTasks = [...tasks, task];
        }
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = (id: number) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            const updatedTasks = tasks.filter(
                (task) => task.id !== taskToDelete,
            );
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTaskToDelete(null);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const indexOfLastTask = currentPage * itemsPerPage;
    const indexOfFirstTask = indexOfLastTask - itemsPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / itemsPerPage);

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
                                onClick={() => setIsModalOpen(true)}
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
                                    <TableRow className="hover:bg-muted/50">
                                        <TableHead className="font-medium">
                                            Title
                                        </TableHead>
                                        <TableHead className="font-medium">
                                            Start Time
                                        </TableHead>
                                        <TableHead className="font-medium">
                                            Duration
                                        </TableHead>
                                        <TableHead className="font-medium">
                                            Repeat
                                        </TableHead>
                                        <TableHead className="font-medium">
                                            Priority
                                        </TableHead>
                                        <TableHead className="font-medium">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentTasks.map((task) => (
                                        <TableRow
                                            key={task.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {task.title}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {new Date(
                                                    task.startTime,
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {task.duration} minutes
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {task.repeat} days
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {task.priority}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleEdit(task)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        className="h-8 w-8 "
                                                        onClick={() =>
                                                            deleteTask(task.id)
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
                        <div className="flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1),
                                                )
                                            }
                                            className={
                                                currentPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <PaginationItem key={index + 1}>
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(index + 1)
                                                }
                                                isActive={
                                                    currentPage === index + 1
                                                }
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages,
                                                    ),
                                                )
                                            }
                                            className={
                                                currentPage === totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                    <TaskModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingTask(null);
                        }}
                        task={editingTask}
                        onSave={saveTask}
                    />
                </CardContent>
            </Card>

            <Dialog
                open={taskToDelete !== null}
                onOpenChange={() => setTaskToDelete(null)}
            >
                <DialogContent className="sm:max-w-[425px] border shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa task này không?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTaskToDelete(null)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
