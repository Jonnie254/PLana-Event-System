import e, { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { Res } from "../interfaces/Res";
import { userRegister } from "../interfaces/user";
import { verifyAdmin, verifyToken } from "../middleware/token.validation";
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
    let user: userRegister = req.body;
    let response: Res = await userService.updateUser(user_id, user);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error updating user:", error);
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

    const response: Res = await userService.approveRoleChangeRequest(
      request_id,
      approve
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

export const protectedApproveRoleChangeRequest = [
  verifyToken,
  verifyAdmin,
  approveRoleChangeRequest,
];
export const protectedGetUserById = [verifyToken, getUserById];
export const protectedUpdateInfo = [verifyToken, updateInfo];
export const protectedDeactivateAccount = [verifyToken, deactivateAccount];
export const protectedRequestRoleChange = [verifyToken, requestRoleChange];
