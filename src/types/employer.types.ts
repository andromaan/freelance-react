import type { UserVM } from "./user.types";

export interface EmployerVM {
  id: string;
  companyName: string | null;
  companyWebsite: string | null;
  user?: UserVM;
}
