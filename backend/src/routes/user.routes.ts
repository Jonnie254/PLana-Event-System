import { Router } from "express";
import {
  getAllUsers,
  protectedApproveRoleChangeRequest,
  protectedChatRoom,
  protectedDeactivateAccount,
  protectedGetUserById,
  protectedRequestRoleChange,
  protectedRoleExists,
  protectedroleRequests,
  protectedUpdateInfo,
  registerUser,
  requestPasswordReset,
  updateUserPassword,
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
userRouter.post("/requestPasswordReset", requestPasswordReset);
userRouter.post("/updatePassword", updateUserPassword);
userRouter.get("/allRoleRequest", protectedroleRequests);
userRouter.get("/checkRoleRequest", protectedRoleExists);
userRouter.get("/getChatRooms", protectedChatRoom);
// userRouter.get("/getUserMessages", protectedGetUserMessages);
export default userRouter;
