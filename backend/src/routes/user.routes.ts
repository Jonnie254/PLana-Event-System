import { Router } from "express";
import {
  getAllUsers,
  protectedApproveRoleChangeRequest,
  protectedDeactivateAccount,
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
userRouter.post("/requestRoleChange", protectedRequestRoleChange);
userRouter.put("/deactivateAccount", protectedDeactivateAccount);
userRouter.post(
  "/admin/approveRoleChangeRequest",
  protectedApproveRoleChangeRequest
);

export default userRouter;
