import { PrismaClient } from "@prisma/client";
import { userRegister } from "../interfaces/user";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

interface Res {
  success: boolean;
  message: string;
  data: any;
}

let prisma = new PrismaClient();

export class UserService {
  // Function to register a user
  async registerUser(user: userRegister): Promise<Res> {
    try {
      const user_id = uuidv4();
      const hashedPassword = await bcrypt.hash(user.password, 6);

      await prisma.user.create({
        data: {
          id: user_id,
          firstname: user.first_name,
          lastname: user.last_name,
          email: user.email,
          password: hashedPassword,
          phone: user.phone,
        },
      });

      return {
        success: true,
        message: "User registered successfully",
        data: null,
      };
    } catch (error: any) {
      if (
        error.message.includes("Unique constraint failed on the constraint:")
      ) {
        return {
          success: false,
          message: "User with the provided email already exists",
          data: null,
        };
      } else {
        console.error("Error registering user:", error);
        return {
          success: false,
          message: "An error occurred while registering user",
          data: null,
        };
      }
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to get all users
  async getAllUsers() {
    try {
      let users = await prisma.user.findMany();
      return {
        success: true,
        message: "Users fetched successfully",
        data: users,
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: "An error occurred while fetching users",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to get a user by ID
  async getUserById(user_id: string) {
    try {
      let user = await prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });
      return {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return {
        success: false,
        message: "An error occurred while fetching user",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to update a user
  async updateUser(user_id: string, user: userRegister) {
    try {
      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          firstname: user.first_name,
          lastname: user.last_name,
          email: user.email,
          phone: user.phone,
        },
      });
      return {
        success: true,
        message: "User updated successfully",
        data: null,
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: "An error occurred while updating user",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  //user deactive account
  async deactivateAccount(user_id: string) {
    try {
      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          isActive: false,
        },
      });
      return {
        success: true,
        message: "User account deactivated successfully",
        data: null,
      };
    } catch (error: any) {
      console.error("Error deactivating user account:", error);
      return {
        success: false,
        message: "An error occurred while deactivating user account",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  // Function to request a role change
  async requestRoleChange(user_id: string, role: string) {
    try {
      const newRoleRequest = await prisma.roleRequest.create({
        data: {
          id: uuidv4(),
          user: { connect: { id: user_id } },
          requestedRole: role,
        },
      });

      return {
        success: true,
        message:
          "Role change requested successfully. Waiting for admin approval.",
        data: newRoleRequest,
      };
    } catch (error: any) {
      console.error("Error requesting role change:", error);
      return {
        success: false,
        message: "An error occurred while requesting role change",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to approve a role change
  async approveRoleChangeRequest(request_id: string, approve: boolean) {
    try {
      const roleRequest = await prisma.roleRequest.findUnique({
        where: { id: request_id },
        include: { user: true },
      });
      if (!roleRequest) {
        return {
          success: false,
          message: "Role change request not found",
          data: null,
        };
      }

      if (approve) {
        await prisma.user.update({
          where: { id: roleRequest.userId },
          data: { role: roleRequest.requestedRole },
        });

        await prisma.roleRequest.delete({
          where: { id: request_id },
        });

        return {
          success: true,
          message: "Role change request approved and user role updated",
          data: null,
        };
      } else {
        await prisma.roleRequest.delete({
          where: { id: request_id },
        });

        return {
          success: true,
          message: "Role change request disapproved",
          data: null,
        };
      }
    } catch (error: any) {
      console.error("Error approving/disapproving role change request:", error);
      return {
        success: false,
        message:
          "An error occurred while approving/disapproving role change request",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}
