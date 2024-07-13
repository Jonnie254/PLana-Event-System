import jwt from "jsonwebtoken";
import { Request } from "express";

const getIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    return decodedToken.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export default getIdFromToken;
