import e, { Request, Response } from "express";
import { Res } from "../interfaces/Res";
import {
  verifyAdmin,
  verifyPlanner,
  verifyToken,
} from "../middleware/token.validation";
import { BookingService } from "../services/booking.services";
import getIdFromToken from "../middleware/token.id";
let bookingService = new BookingService();

// Create a booking
const createBooking = async (req: Request, res: Response) => {
  const { eventId, ticketType, slots } = req.body;
  const userId = getIdFromToken(req);

  const bookingData = {
    eventId,
    userId,
    ticketType,
    slots,
  };

  try {
    const response: Res = await bookingService.bookEvent({
      ...bookingData,
      userId: userId || "",
    });

    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating booking",
      data: null,
    });
  }
};

// Get all bookings
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const response: Res = await bookingService.getAllBookings();

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting bookings",
      data: null,
    });
  }
};

//get all bookings by user
const getBookingsByUser = async (req: Request, res: Response) => {
  const userId = getIdFromToken(req);
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not found in token",
      data: null,
    });
  }

  try {
    const response: Res = await bookingService.getBookingsByUser(userId);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting bookings",
      data: null,
    });
  }
};
//get bookings to a particular planner
const getBookingsToPlanner = async (req: Request, res: Response) => {
  const userId = getIdFromToken(req);
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not found in token",
      data: null,
    });
  }

  try {
    const response: Res = await bookingService.getBookingsToPlanner(userId);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting bookings",
      data: null,
    });
  }
};
//function to cancel  a booking by a user
const cancelBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = getIdFromToken(req);
  console.log("controller bookingId", bookingId);
  console.log("controller userId", userId);

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not found in token",
      data: null,
    });
  }

  try {
    const response: Res = await bookingService.cancelBooking(userId, bookingId);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling booking",
      data: null,
    });
  }
};

export const protectedCancelBooking = [verifyToken, cancelBooking];
export const protectedGetBookingsbyPlanner = [
  verifyToken,
  verifyPlanner,
  getBookingsToPlanner,
];
export const protectedGetBookingsByUser = [verifyToken, getBookingsByUser];
export const protectedGetAllBookings = [
  verifyToken,
  verifyAdmin,
  getAllBookings,
];
export const protectedBookEvent = [verifyToken, createBooking];
