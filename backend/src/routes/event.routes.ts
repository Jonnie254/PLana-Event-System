import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  protectedGetEventsByPlanner,
  protectedCreateEvent,
  protectedUpdateEvent,
  protectedRequestEventPromotion,
  protectedapprovedEventPromotion,
  getApprovedPromotions,
  protectedGetEventsUpcoming,
  protectedEventsWithOrganizers,
} from "../controller/event.controller";

let eventRouter = Router();
eventRouter.post("/createEvent", protectedCreateEvent);
eventRouter.get("/getAllEvents", getAllEvents);
eventRouter.get("/getEventById/:id", getEventById);
eventRouter.get("/getEventsByPlanner", protectedGetEventsByPlanner);
eventRouter.put("/updateEvent/:id", protectedUpdateEvent);
eventRouter.post("/reqeustpromotion/:id", protectedRequestEventPromotion);
eventRouter.post("/approvepromotion/:id", protectedapprovedEventPromotion);
eventRouter.get("/upcomingEvents", protectedGetEventsUpcoming);
eventRouter.get("/promotions", getApprovedPromotions);
eventRouter.get("/getApprovedPromotion", getApprovedPromotions);
eventRouter.get("/getAllEventsWithOrganizers", protectedEventsWithOrganizers);
export default eventRouter;
