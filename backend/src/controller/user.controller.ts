import e, { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { Res } from "../interfaces/Res";
import { updateRole, userRegister, userUpdate } from "../interfaces/user";
import {
  verifyAdmin,
  verifyResetTokenMiddleware,
  verifyToken,
  verifyUser,
} from "../middleware/token.validation";
import getIdFromToken from "../middleware/token.id";
let userService = new UserService();
// Function to register a user
export const registerUser = async (req: Request, res: Response) => {
  let user: userRegister = req.body;
  let response: Res = await userService.registerUser(user);
  if (response.success) {
    res.status(201).json(response);
  } else {
    res.status(400).json(response);
  }
};
// Function to get all users
export const getAllUsers = async (req: Request, res: Response) => {
  let response: Res = await userService.getAllUsers();
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};
// Function to get a user by ID
const getUserById = async (req: Request, res: Response) => {
  let id = getIdFromToken(req);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      data: null,
    });
  }
  let response: Res = await userService.getUserById(id);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};
// Function to update a user
const updateInfo = async (req: Request, res: Response) => {
  try {
    let user_id = getIdFromToken(req);
    if (!user_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access", data: null });
    }
    let user: userUpdate = req.body;
    let response: Res = await userService.updateUser(user_id, user);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user",
      data: null,
    });
  }
};

//function to deactivate account
const deactivateAccount = async (req: Request, res: Response) => {
  try {
    let user_id = getIdFromToken(req);
    if (!user_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access", data: null });
    }
    const response: Res = await userService.deactivateAccount(user_id);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error deactivating account:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deactivating account",
      data: null,
    });
  }
};
//function to check if the role request already exists
const checkRoleRequest = async (req: Request, res: Response) => {
  try {
    let user_id = getIdFromToken(req);
    if (!user_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access", data: null });
    }
    const response: Res = await userService.checkRoleRequest(user_id);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error checking role request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking role request",
      data: null,
    });
  }
};
//function to request role change
const requestRoleChange = async (req: Request, res: Response) => {
  try {
    let user_id = getIdFromToken(req);
    if (!user_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access", data: null });
    }
    const role = req.body.role;
    const response: Res = await userService.requestRoleChange(user_id, role);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error requesting role change:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while requesting role change",
      data: null,
    });
  }
};

// Function to approve/disapprove role change request
const approveRoleChangeRequest = async (req: Request, res: Response) => {
  try {
    const { request_id, approve } = req.body;

    if (!request_id || approve === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID or approval status",
        data: null,
      });
    }

    const updateRoleRequest: updateRole = { request_id, approve };
    const response = await userService.approveRoleChangeRequest(
      updateRoleRequest
    );

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error approving/disapproving role change request:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while approving/disapproving role change request",
      data: null,
    });
  }
};
// request password reset
const userPasswordRequest = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const response: Res = await userService.requestPasswordReset(email);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while requesting password reset",
      data: null,
    });
  }
};

//function to update the passord
const updatePassword = async (req: Request, res: Response) => {
  try {
    const { passwordinfo } = req.body;
    const { email, newPassword } = passwordinfo;

    const response: Res = await userService.updatePassword(email, newPassword);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating password",
      data: null,
    });
  }
};
//function to get all role request
const allRoleRequest = async (req: Request, res: Response) => {
  try {
    const response: Res = await userService.getAllRoleRequest();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching role request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching role request",
      data: null,
    });
  }
};

//function to get the chatroom
const getChatRoom = async (req: Request, res: Response) => {
  try {
    const userId = getIdFromToken(req) || "";
    const response: Res = await userService.getUserChatRooms(userId);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching chat room:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching chat room",
      data: null,
    });
  }
};
//delete role request
const deleteRoleRequest = async (req: Request, res: Response) => {
  try {
    const request_id = req.body.request_id;
    const response: Res = await userService.deleteRoleRequest(request_id);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error deleting role request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting role request",
      data: null,
    });
  }
};

//function to get user messages
// export const getUserMessages = async (req: Request, res: Response) => {
//   try {
//     const response: Res = await userService.getUsersWithLastMessage();
//     if (response.success) {
//       res.status(200).json(response);
//     } else {
//       res.status(400).json(response);
//     }
//   } catch (error) {
//     console.error("Error fetching user messages:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching user messages",
//       data: null,
//     });
//   }
// };

// export const protectedGetUserMessages = [verifyToken, getUserMessages];
export const protectedDeleteRoleRequest = [
  verifyToken,
  verifyAdmin,
  deleteRoleRequest,
];
export const protectedChatRoom = [verifyToken, getChatRoom];
export const protectedRoleExists = [verifyToken, checkRoleRequest];
export const updateUserPassword = [verifyResetTokenMiddleware, updatePassword];
export const requestPasswordReset = [userPasswordRequest];
export const protectedroleRequests = [verifyToken, verifyAdmin, allRoleRequest];
export const protectedApproveRoleChangeRequest = [
  verifyToken,
  verifyAdmin,
  approveRoleChangeRequest,
];
export const protectedGetUserById = [verifyToken, getUserById];
export const protectedUpdateInfo = [verifyToken, updateInfo];
export const protectedDeactivateAccount = [verifyToken, deactivateAccount];
export const protectedRequestRoleChange = [
  verifyToken,
  verifyUser,
  requestRoleChange,
];
