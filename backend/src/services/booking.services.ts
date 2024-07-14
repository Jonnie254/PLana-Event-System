import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BookingData } from "../interfaces/Event";
import { Res } from "../interfaces/Res";
import { sendBookingEmail } from "./booking.email.service";

const prisma = new PrismaClient();

export class BookingService {
  async bookEvent(booking: BookingData): Promise<Res> {
    const { eventId, userId, ticketType, slots } = booking;
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });
      if (!event) {
        return {
          success: false,
          message: "Event not found",
          data: null,
        };
      }

      const tickets =
        ticketType === "single" ? event.singleTickets : event.groupTickets;
      let availableTicket = tickets.find((ticket) => ticket.slots >= slots);
      if (!availableTicket) {
        return {
          success: false,
          message: "Tickets not available",
          data: null,
        };
      }

      // Create booking
      const bookingRecord = await prisma.booking.create({
        data: {
          id: uuidv4(),
          ticketNumber: uuidv4(),
          event: { connect: { id: eventId } },
          user: { connect: { id: userId } },
          ticketType,
          eventLocation: event.location,
          eventDate: event.date,
          eventTime: event.eventTime,
          eventImage: event.image,
          status: "confirmed",
          canEdit: true,
          canCancel: true,
          canDelete: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update ticket slots
      if (ticketType === "single") {
        await prisma.singleTicket.update({
          where: { id: availableTicket.id },
          data: { slots: availableTicket.slots - slots },
        });
      } else {
        await prisma.groupTicket.update({
          where: { id: availableTicket.id },
          data: { slots: availableTicket.slots - slots },
        });
      }
      await sendBookingEmail(bookingRecord);

      return {
        success: true,
        message: "Booking successful",
        data: bookingRecord,
      };
    } catch (error: any) {
      console.error("Error booking ticket:", error);
      return {
        success: false,
        message: "An error occurred while booking the ticket",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}
