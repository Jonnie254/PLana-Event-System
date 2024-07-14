import e, { Request, Response } from "express";
import { Res } from "../interfaces/Res";
import { verifyToken } from "../middleware/token.validation";
import { BookingService } from "../services/booking.services";
import getIdFromToken from "../middleware/token.id";
let bookingService = new BookingService();

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
export const protectedBookEvent = [verifyToken, createBooking];
