export type Role = "admin" | "user";
export type UserStatus = "active" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only
  role: Role;
  status: UserStatus;
  createdAt: string;
}

