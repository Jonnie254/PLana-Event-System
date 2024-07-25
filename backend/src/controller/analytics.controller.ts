import { Request, Response } from "express";
import { Res } from "../interfaces/Res";
import { AnalyticsService } from "../services/analytics.service";
import {
  verifyAdmin,
  verifyPlanner,
  verifyToken,
} from "../middleware/token.validation";

import getIdFromToken from "../middleware/token.id";

let analyticsService = new AnalyticsService();
const getAllBookings = async (req: Request, res: Response) => {
  let response: Res = await analyticsService.getAllBookings();
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};

const totalRevenue = async (req: Request, res: Response) => {
  let response: Res = await analyticsService.totalRevenue();
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};

const plannerTotalRevenue = async (req: Request, res: Response) => {
  const plannerId = getIdFromToken(req);
  console.log("Planner ID: ", plannerId);
  if (!plannerId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No valid planner ID found",
      data: null,
    });
  }
  try {
    const response: Res = await analyticsService.totalPlannerRevenue(plannerId);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching total revenue",
      data: null,
    });
  }
};
export const protectedPlannerTotalRevenue = [verifyToken, plannerTotalRevenue];
export const protectedAdminTotalRevenue = [
  verifyToken,
  verifyAdmin,
  totalRevenue,
];
export const protectedAdminGetAllBookings = [
  verifyToken,
  verifyAdmin,
  getAllBookings,
];
