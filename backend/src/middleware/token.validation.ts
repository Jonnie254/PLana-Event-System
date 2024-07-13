import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

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
