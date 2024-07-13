import { User } from "./user";

export interface RoleRequest {
  id: number;
  user: User;
  userId: string;
  requestedRole: string;
  createdAt: Date;
  updatedAt: Date;
}
