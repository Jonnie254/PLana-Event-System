import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userLogins } from "../interfaces/user";
import { Res } from "../interfaces/Res";
let prisma = new PrismaClient();
export class AuthService {
  async login(userDetails: userLogins): Promise<Res> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userDetails.email,
        },
      });
      if (!user) {
        return {
          success: false,
          message: "User with details does not exist",
          data: null,
        };
      }
      const passwordMatch = await bcrypt.compare(
        userDetails.password,
        user.password
      );
      if (!passwordMatch) {
        return {
          success: false,
          message: "Invalid password",
          data: null,
        };
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      console.log("success");
      return {
        success: true,
        message: "User logged in successfully",
        data: token,
      };
    } catch (error: any) {
      console.error("Error logging in user:", error);
      return {
        success: false,
        message: "An error occurred while logging in user",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}
