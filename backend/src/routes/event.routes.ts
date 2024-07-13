import e, { Router } from "express";
import {
  getAllEvents,
  getEventById,
  protectedGetEventsByPlanner,
  protectedCreateEvent,
  protectedUpdateEvent,
} from "../controller/event.controller";

let eventRouter = Router();
eventRouter.post("/createEvent", protectedCreateEvent);
eventRouter.get("/getAllEvents", getAllEvents);
eventRouter.get("/getEventById/:id", getEventById);
eventRouter.get("/getEventsByPlanner", protectedGetEventsByPlanner);
eventRouter.put("/updateEvent/:id", protectedUpdateEvent);
export default eventRouter;
