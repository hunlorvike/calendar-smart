import { useState, useCallback } from 'react';
import { Task } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { TaskFormData } from '@/types/task';
import axiosInstance from '@/lib/axios';

interface TaskManagerState {
    tasks: Task[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    selectedTask: Task | null;
}

export function useTaskManager() {
    const { toast } = useToast();
    const [state, setState] = useState<TaskManagerState>({
        tasks: [],
        isLoading: false,
        currentPage: 1,
        totalPages: 1,
        selectedTask: null,
    });

    const fetchTasks = useCallback(
        async (page = 1, pageSize = 5) => {
            try {
                setState((prev) => ({ ...prev, isLoading: true }));
                const response = await axiosInstance.get('/tasks', {
                    params: { page, pageSize },
                });
                setState((prev) => ({
                    ...prev,
                    tasks: response.data.data.items,
                    totalPages: response.data.data.totalPages,
                    currentPage: page,
                }));
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch tasks',
                    variant: 'destructive',
                    duration: 3000,
                });
            } finally {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [toast],
    );

    const createTask = useCallback(
        async (taskData: TaskFormData) => {
            try {
                setState((prev) => ({ ...prev, isLoading: true }));
                const response = await axiosInstance.post('/tasks', taskData);
                toast({
                    title: 'Success',
                    description: 'Task created successfully',
                    duration: 3000,
                });
                await fetchTasks(state.currentPage);
                return response.data.data;
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to create task',
                    variant: 'destructive',
                    duration: 3000,
                });
                return null;
            } finally {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [toast, fetchTasks, state.currentPage],
    );

    const updateTask = useCallback(
        async (taskId: number, taskData: TaskFormData) => {
            try {
                setState((prev) => ({ ...prev, isLoading: true }));
                const response = await axiosInstance.put(
                    `/tasks/${taskId}`,
                    taskData,
                );
                toast({
                    title: 'Success',
                    description: 'Task updated successfully',
                    duration: 3000,
                });
                await fetchTasks(state.currentPage);
                return response.data.data;
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to update task',
                    variant: 'destructive',
                    duration: 3000,
                });
                return null;
            } finally {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [toast, fetchTasks, state.currentPage],
    );

    const deleteTask = useCallback(
        async (taskId: number) => {
            try {
                setState((prev) => ({ ...prev, isLoading: true }));
                await axiosInstance.delete(`/tasks/${taskId}`);
                toast({
                    title: 'Success',
                    description: 'Task deleted successfully',
                    duration: 3000,
                });
                await fetchTasks(state.currentPage);
                return true;
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to delete task',
                    variant: 'destructive',
                    duration: 3000,
                });
                return false;
            } finally {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [toast, fetchTasks, state.currentPage],
    );

    return {
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        selectTask: (task: Task | null) =>
            setState((prev) => ({ ...prev, selectedTask: task })),
    };
}
