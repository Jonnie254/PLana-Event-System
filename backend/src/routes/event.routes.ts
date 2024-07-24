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
  protectedgetPromotionRequests,
} from "../controller/event.controller";

let eventRouter = Router();
eventRouter.post("/createEvent", protectedCreateEvent);
eventRouter.get("/getAllEvents", getAllEvents);
eventRouter.get("/getEventById/:id", getEventById);
eventRouter.get("/getEventsByPlanner", protectedGetEventsByPlanner);
eventRouter.put("/updateEvent/:id", protectedUpdateEvent);
eventRouter.post("/requestpromotion/:id", protectedRequestEventPromotion);
eventRouter.put("/approvepromotion/:id", protectedapprovedEventPromotion);
eventRouter.get("/upcomingEvents", protectedGetEventsUpcoming);
eventRouter.get("/promotions", getApprovedPromotions);
eventRouter.get("/getApprovedPromotions", getApprovedPromotions);
eventRouter.get("/getAllEventsWithOrganizers", protectedEventsWithOrganizers);
eventRouter.get("/promotionrequest", protectedgetPromotionRequests);
export default eventRouter;
