export const ROLES = {
  ADMIN: "admin",
  EMPLOYER: "employer",
  MODERATOR: "moderator",
  FREELANCER: "freelancer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const isRole = (v: unknown): v is Role =>
  typeof v === "string" && Object.values(ROLES).includes(v as Role);
