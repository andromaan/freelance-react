import type { CategoriesVM } from "./category.type";

export interface ProjectVM {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categories: CategoriesVM[];
  status: ProjectStatus;
}

export const ProjectStatus = {
  Open: "Open",
  InProgress: "InProgress",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
