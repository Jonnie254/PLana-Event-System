import { User } from "./user";

export interface RoleRequest {
  id: string;
  user: User;
  userId: string;
  requestedRole: string;
  createdAt: Date;
  updatedAt: Date;
}
