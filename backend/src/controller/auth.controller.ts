import { Request, Response } from "express";
import { userLogins } from "../interfaces/user";
import { Res } from "../interfaces/Res";
import { AuthService } from "../services/auth.service";
let authService = new AuthService();
export const login = async (req: Request, res: Response) => {
  let user: userLogins = req.body;
  let response: Res = await authService.login(user);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};
