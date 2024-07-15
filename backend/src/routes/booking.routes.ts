import { Router } from "express";
import {
  protectedBookEvent,
  protectedCancelBooking,
  protectedGetAllBookings,
  protectedGetBookingsbyPlanner,
  protectedGetBookingsByUser,
} from "../controller/booking.controller";

let bookingRouter = Router();
bookingRouter.post("/bookEvent", protectedBookEvent);
bookingRouter.get("/getAllBookings", protectedGetAllBookings);
bookingRouter.get("/getBookingsByUser", protectedGetBookingsByUser);
bookingRouter.get("/getBookingsByPlanner", protectedGetBookingsbyPlanner);
bookingRouter.put("/cancelBooking/:id", protectedCancelBooking);
export default bookingRouter;
