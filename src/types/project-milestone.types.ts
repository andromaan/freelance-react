export interface ProjectMilestoneVM {
    id: string;
    projectId: string;
    description: string;
    amount: number;
    dueDate: string;
}

export interface CreateProjectMilestoneVM {
    projectId: string;
    description?: string;
    amount: number;
    dueDate: string;
}

export interface UpdateProjectMilestoneVM {
    id: string;
    description?: string;
    amount?: number;
    dueDate?: string;
}