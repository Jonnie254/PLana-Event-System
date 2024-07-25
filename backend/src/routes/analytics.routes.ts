import { Router } from "express";
import {
  protectedAdminGetAllBookings,
  protectedAdminTotalRevenue,
} from "../controller/analytics.controller";

let analyticsRouter = Router();

analyticsRouter.get("/getAllBookings", protectedAdminGetAllBookings);
analyticsRouter.get("/totalRevenue", protectedAdminTotalRevenue);
analyticsRouter.get("/totalPlannerRevenue", protectedAdminTotalRevenue);
export default analyticsRouter;
