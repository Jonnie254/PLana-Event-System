import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userLogins } from "../interfaces/user";
import { Res } from "../interfaces/Res";
import { loginSchema } from "../middleware/validate.inputs";
export class AuthService {
  prisma = new PrismaClient();
  async login(userDetails: userLogins): Promise<Res> {
    try {
      const { error } = loginSchema.validate(userDetails);
      if (error) {
        return {
          success: false,
          message: `${error.details[0].message}`,
          data: null,
        };
      }
      const user = await this.prisma.user.findUnique({
        where: {
          email: userDetails.email,
          isActive: true,
        },
      });
      if (!user) {
        return {
          success: false,
          message: "User with this email does not exist",
          data: null,
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: "User account is inactive",
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
      await this.prisma.$disconnect();
    }
  }
}
