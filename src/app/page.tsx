'use client';

import { useEffect } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskModal } from '@/components/tasks/task-modal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTaskManager } from '@/hooks/use-task-manager';

export default function TasksPage() {
    const {
        tasks,
        isLoading,
        currentPage,
        totalPages,
        selectedTask,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        selectTask,
    } = useTaskManager();

    useEffect(() => {
        fetchTasks(currentPage);
    }, [fetchTasks, currentPage]);

    const handlePageChange = (page: number) => {
        fetchTasks(page);
    };

    if (isLoading && tasks.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-8">
            <TaskList
                tasks={tasks}
                onEdit={selectTask}
                onDelete={deleteTask}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <TaskModal
                isOpen={selectedTask !== null}
                onClose={() => selectTask(null)}
                task={selectedTask}
                mode={selectedTask?.id ? 'edit' : 'create'}
                onSave={async (data) => {
                    if (selectedTask?.id) {
                        await updateTask(selectedTask.id, data);
                    } else {
                        await createTask(data);
                    }
                }}
            />
        </div>
    );
}
