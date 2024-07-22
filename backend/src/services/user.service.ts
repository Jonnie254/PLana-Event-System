import { PrismaClient } from "@prisma/client";
import { updateRole, userRegister, userUpdate } from "../interfaces/user";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { send } from "process";
import { sendMail } from "../bg-services/helpermail";
import {
  sendResetPasswordEmail,
  sendRoleApprovalEmail,
  sendRoleRequestEmail,
} from "./booking.email.service";
import { Res } from "../interfaces/Res";
import { requestRoleSchema, userSchema } from "../middleware/validate.inputs";

let prisma = new PrismaClient();

export class UserService {
  // Function to register a user
  async registerUser(user: userRegister): Promise<Res> {
    try {
      const { error } = userSchema.validate(user);
      if (error) {
        return {
          success: false,
          message: `Validation error: ${error.details[0].message}`,
          data: null,
        };
      }
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
  async updateUser(user_id: string, user: userUpdate) {
    try {
      const hashedPassword = user.password
        ? await bcrypt.hash(user.password, 6)
        : undefined;
      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        message: "User updated successfully",
        data: null,
      };
    } catch (error: any) {
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
      const user = await prisma.user.findUnique({
        where: { id: user_id },
      });

      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      const newRoleRequest = await prisma.roleRequest.create({
        data: {
          id: uuidv4(),
          user: { connect: { id: user_id } },
          requestedRole: role,
        },
      });

      await sendRoleRequestEmail(
        { email: user.email, name: user.firstname },
        role
      );

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
  // Function to check if a role change request exists
  async checkRoleRequest(user_id: string) {
    try {
      const roleRequest = await prisma.roleRequest.findFirst({
        where: { userId: user_id },
      });

      if (!roleRequest) {
        return {
          success: true,
          message: "No role change request found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Role change request found",
        data: null,
      };
    } catch (error: any) {
      console.error("Error checking role request:", error);
      return {
        success: false,
        message: "An error occurred while checking role request",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  // Function to approve a role change
  async approveRoleChangeRequest({ request_id, approve }: updateRole) {
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

        try {
          await sendRoleApprovalEmail(
            roleRequest.user.email,
            roleRequest.requestedRole
          );
        } catch (emailError) {
          console.error("Error sending role approval email:", emailError);
          // Continue despite the email failure
        }

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
  /// request password reset
  generaterandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  async requestPasswordReset(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return {
          success: false,
          message: "User with this email does not exist",
          data: null,
        };
      }
      const resetCode = this.generaterandomCode();
      const expireat = new Date(Date.now() + 3600 * 1000);
      await prisma.passwordReset.create({
        data: {
          id: uuidv4(),
          email,
          user: { connect: { id: user.id } },
          code: resetCode,
          ExpiresAt: expireat,
        },
      });
      await sendResetPasswordEmail(email, resetCode);
      return {
        success: true,
        message: "Password reset code sent to email",
        data: resetCode,
      };
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      return {
        success: false,
        message: "An error occurred while requesting password reset",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  //function to update password
  updatePassword = async (email: string, password: string) => {
    try {
      const { error } = requestRoleSchema.validate({ email, password });
      if (error) {
        return {
          success: false,
          message: `Validation error: ${error.details[0].message}`,
          data: null,
        };
      }
      const hashedPassword = await bcrypt.hash(password, 6);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        success: true,
        message: "Password updated successfully",
        data: null,
      };
    } catch (error: any) {
      console.error("Error updating password:", error);
      return {
        success: false,
        message: "An error occurred while updating password",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  };
  //get All role request
  async getAllRoleRequest() {
    try {
      let roleRequest = await prisma.roleRequest.findMany();
      return {
        success: true,
        message: "Role request fetched successfully",
        data: roleRequest,
      };
    } catch (error: any) {
      console.error("Error fetching role request:", error);
      return {
        success: false,
        message: "An error occurred while fetching role request",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to get chat rooms for a user
  async getUserChatRooms(userId: string) {
    try {
      // Fetch chat rooms where the user is a participant
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc", // Ensure messages are ordered by creation time
            },
          },
          users: {
            include: {
              user: true, // Fetch all details of the user
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (chatRooms.length === 0) {
        return {
          success: false,
          message: "No chat rooms found for the user",
          data: null,
        };
      }

      // Format chat rooms with messages and participants
      const formattedChatRooms = chatRooms.map((room) => {
        // Format messages to include sender details
        const formattedMessages = room.messages.map((message) => ({
          id: message.id,
          senderId: message.senderId,
          chatRoomId: message.chatRoomId,
          message: message.message,
          createdAt: message.createdAt,
          sender:
            room.users.find((u) => u.user.id === message.senderId)?.user ||
            null,
        }));

        // Extract participants excluding the current user
        const participants = room.users
          .map((u) => u.user)
          .filter((u) => u.id !== userId);

        return {
          id: room.id,
          eventId: room.event.id,
          event: {
            id: room.event.id,
            name: room.event.name,
            image: room.event.image,
          },
          users: participants,
          messages: formattedMessages,
          latestMessage:
            formattedMessages[formattedMessages.length - 1] || null, // Latest message
        };
      });

      return {
        success: true,
        message: "User chat rooms fetched successfully",
        data: formattedChatRooms,
      };
    } catch (error: any) {
      console.error("Error fetching user chat rooms:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
}
