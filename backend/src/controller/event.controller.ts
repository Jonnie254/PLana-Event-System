import e, { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { Res } from "../interfaces/Res";
import { Event } from "../interfaces/Event";
import {
  verifyToken,
  verifyPlanner,
  verifyPlannerOrAdmin,
} from "../middleware/token.validation";
import getIdFromToken from "../middleware/token.id";
let eventService = new EventService();

// Function to create an event
const createEvent = async (req: Request, res: Response) => {
  const {
    name,
    image,
    description,
    date,
    location,
    eventTime,
    groupTickets,
    singleTickets,
  } = req.body;
  const createdById = getIdFromToken(req);

  const newEvent: Event = {
    id: "",
    name,
    image,
    description,
    date,
    location,
    eventTime,
    createdById: createdById || "",
    groupTickets,
    singleTickets,
  };

  try {
    const response: Res = await eventService.createEvent(newEvent);

    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating event",
      data: null,
    });
  }
};

//function to get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const response: Res = await eventService.getAllEvents();

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching events",
      data: null,
    });
  }
};
//function to get events by id
export const getEventById = async (req: Request, res: Response) => {
  let event_id = req.params.id;
  try {
    const response: Res = await eventService.getEventById(event_id);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching event",
      data: null,
    });
  }
};
//function to get events by planner
export const getEventsByPlanner = async (req: Request, res: Response) => {
  let planner_id = getIdFromToken(req);
  try {
    const response: Res = await eventService.getEventByPlanner(
      planner_id || ""
    );
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching event",
      data: null,
    });
  }
};
//function to update event
export const updateEvent = async (req: Request, res: Response) => {
  const event_id = req.params.id;
  const event: Event = req.body;
  try {
    const response: Res = await eventService.updateEvent(event_id, event);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating event",
      data: null,
    });
  }
};
export const protectedUpdateEvent = [
  verifyToken,
  verifyPlannerOrAdmin,
  updateEvent,
];

export const protectedCreateEvent = [verifyToken, verifyPlanner, createEvent];
export const protectedGetEventsByPlanner = [verifyToken, getEventsByPlanner];
