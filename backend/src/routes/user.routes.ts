import { Router } from "express";
import {
  getAllUsers,
  protectedGetUserById,
  protectedRequestRoleChange,
  protectedUpdateInfo,
  registerUser,
} from "../controller/user.controller";
let userRouter = Router();

userRouter.post("/registerUser", registerUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUserById", protectedGetUserById);
userRouter.put("/updateinfo", protectedUpdateInfo);
userRouter.put("/requestRoleChange", protectedRequestRoleChange);

export default userRouter;
