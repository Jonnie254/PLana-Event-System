import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { passwordReset } from "../interfaces/user";
const prisma = new PrismaClient();
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", data: null });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", data: null });
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  try {
    const response: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof response === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    } else if (response.role && response.role === "admin") {
      return next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }
  } catch (error: any) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", data: null });
  }
};
export const verifyPlanner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  try {
    const response: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof response === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    } else if (response.role && response.role === "Event Planner") {
      return next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }
  } catch (error: any) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", data: null });
  }
};
export const verifyPlannerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }
  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }
    const response: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    if (typeof response === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    } else if (
      response.role &&
      (response.role === "Event Planner" || response.role === "admin")
    ) {
      return next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }
  } catch (error: any) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", data: null });
  }
};
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Retrieve authorization header
  const authHeader = req.headers["authorization"];

  // Check if the authorization header is present
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied", data: null });
  }

  try {
    // Verify token
    const response: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // Check if the response is a string (indicating an error)
    if (typeof response === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }

    // Check if the role is "user" and add userId to the request object
    if (response.role && response.role === "user") {
      return next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Access denied", data: null });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", data: null });
  }
};
export const verifyResetTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { passwordinfo } = req.body;
  const { resetCode } = passwordinfo as passwordReset;
  if (!resetCode) {
    return res
      .status(400)
      .json({ success: false, message: "Reset code is required" });
  }
  try {
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { code: resetCode },
      include: { user: true },
    });

    if (!resetRecord || new Date() > resetRecord.ExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
        data: null,
      });
    }
    req.body.email = resetRecord.user.email;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying reset token",
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};
