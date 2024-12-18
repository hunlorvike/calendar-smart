export interface Task {
    id: number;
    title: string;
    description: string;
    startTime: string;
    duration: number;
    repeat: number;
    priority: 'high' | 'medium' | 'low';
}

export interface User {
    username: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
