import e, { Request, Response } from "express";
import { Res } from "../interfaces/Res";
import {
  verifyAdmin,
  verifyPlanner,
  verifyToken,
  verifyUser,
} from "../middleware/token.validation";
import { BookingService } from "../services/booking.services";
import getIdFromToken from "../middleware/token.id";
import { BookingData } from "../interfaces/Event";
let bookingService = new BookingService();

// Create a booking
const createBooking = async (req: Request, res: Response) => {
  const { eventId, ticketType, groupEmails } = req.body;
  const userId = getIdFromToken(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User ID not found in token",
      data: null,
    });
  }

  const bookingData: BookingData = {
    eventId,
    userId,
    ticketType,
    groupEmails,
  };

  try {
    // Validate input
    if (!eventId || !ticketType) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: eventId and ticketType are required",
        data: null,
      });
    }

    // Additional validation for group bookings
    if (ticketType === "group") {
      if (
        !groupEmails ||
        !Array.isArray(groupEmails) ||
        groupEmails.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "For group bookings, groupEmails must be provided as a non-empty array",
          data: null,
        });
      }
    } else if (groupEmails) {
      // If it's a single ticket, groupEmails should not be provided
      return res.status(400).json({
        success: false,
        message: "groupEmails should only be provided for group bookings",
        data: null,
      });
    }

    const response = await bookingService.bookEvent(bookingData);

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
export const protectedBookEvent = [verifyToken, verifyUser, createBooking];
