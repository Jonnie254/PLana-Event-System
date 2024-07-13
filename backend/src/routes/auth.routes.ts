import Router from "express";
import { login } from "../controller/auth.controller";
let authRouter = Router();
authRouter.post("/login", login);
export default authRouter;
