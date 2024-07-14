import { Router } from "express";
import { protectedBookEvent } from "../controller/booking.controller";

let bookingRouter = Router();
bookingRouter.post("/bookEvent", protectedBookEvent);
export default bookingRouter;
