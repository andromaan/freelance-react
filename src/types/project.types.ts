import type { CategoriesVM } from "./category.type";

export interface MilestoneVM {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface ProjectVM {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categories: CategoriesVM[];
  status: ProjectStatus;

  // Optional counts for UI
  bidsCount?: number;
  quotesCount?: number;
  milestones?: MilestoneVM[];
}

export const ProjectStatus = {
  Open: "Open",
  InProgress: "InProgress",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
