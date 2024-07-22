import e, { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { Res } from "../interfaces/Res";
import { Event } from "../interfaces/Event";
import {
  verifyToken,
  verifyPlanner,
  verifyPlannerOrAdmin,
  verifyAdmin,
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
//function to request event promotion
export const requestEventPromotion = async (req: Request, res: Response) => {
  const event_id = req.params.id;
  const user_id = getIdFromToken(req);
  try {
    const response: Res = await eventService.requestEventPromotion(
      event_id,
      user_id ?? ""
    );
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error requesting event promotion:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while requesting event promotion",
      data: null,
    });
  }
};
//function to approve event promotion
export const approveEventPromotionById = async (
  req: Request,
  res: Response
) => {
  const promotion_id = req.params.id;
  const isApproved = req.body.isApproved;
  try {
    const response: Res = await eventService.approveEventPromotionById(
      promotion_id,
      isApproved
    );
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error approving event promotion:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while approving event promotion",
      data: null,
    });
  }
};
//function to get all promotion requests
export const getPromotionRequests = async (req: Request, res: Response) => {
  try {
    const response: Res = await eventService.getAllEventPromotions();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching promotion requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching promotion requests",
      data: null,
    });
  }
};
//all events promotion for the user
export const getApprovedPromotions = async (req: Request, res: Response) => {
  try {
    const response: Res = await eventService.getAllApprovedEventPromotions();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching promotion requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching promotion requests",
      data: null,
    });
  }
};
//function to get events that have not been booked
export const getEventsUpcoming = async (req: Request, res: Response) => {
  const user_id = getIdFromToken(req);
  try {
    const response: Res = await eventService.getAvailableEvents(user_id || "");
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error fetching promotion requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching promotion requests",
      data: null,
    });
  }
};
export const protectedGetEventsUpcoming = [verifyToken, getEventsUpcoming];
export const protectedgetPromotionRequests = [
  verifyToken,
  verifyAdmin,
  getPromotionRequests,
];
export const protectedapprovedEventPromotion = [
  verifyToken,
  verifyAdmin,
  approveEventPromotionById,
];
export const protectedRequestEventPromotion = [
  verifyToken,
  verifyPlanner,
  requestEventPromotion,
];
export const protectedUpdateEvent = [
  verifyToken,
  verifyPlannerOrAdmin,
  updateEvent,
];
export const protectedEventPromotions = [
  verifyToken,
  verifyAdmin,
  getPromotionRequests,
];
export const protectedCreateEvent = [verifyToken, verifyPlanner, createEvent];
export const protectedGetEventsByPlanner = [verifyToken, getEventsByPlanner];
