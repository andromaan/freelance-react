export interface ContractVM {
    id: string;
    projectId: string;
    freelancerId: string;
    startDate: Date;
    endDate?: Date;
    agreedRate: number;
    status: string;
    employerUserId: string;
}