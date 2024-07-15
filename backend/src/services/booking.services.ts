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
          singleTicketSlots: ticketType === "single" ? slots : 0,
          groupTicketSlots: ticketType === "group" ? slots : 0,
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
      //remember here
      // await sendBookingEmail(bookingRecord);

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
  // Function to get all bookings
  async getAllBookings(): Promise<Res> {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          user: true,
          event: true,
        },
      });

      return {
        success: true,
        message: "Bookings fetched successfully",
        data: bookings,
      };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      return {
        success: false,
        message: "An error occurred while fetching bookings",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  //function to get all bookings by user
  async getBookingsByUser(userId: string): Promise<Res> {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          user: true,
          event: true,
        },
      });

      return {
        success: true,
        message: "Bookings fetched successfully",
        data: bookings,
      };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      return {
        success: false,
        message: "An error occurred while fetching bookings",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  //function to get bookings to specific planner
  async getBookingsToPlanner(plannerId: string): Promise<Res> {
    try {
      const bookings = await prisma.booking.findMany({
        where: { event: { createdById: plannerId } },
        include: {
          user: true,
          event: true,
        },
      });

      return {
        success: true,
        message: "Bookings fetched successfully",
        data: bookings,
      };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      return {
        success: false,
        message: "An error occurred while fetching bookings",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  //funcion to cancel booking
  async cancelBooking(userId: string, bookingId: string): Promise<Res> {
    try {
      // Fetch the booking including the associated event details
      const existingBooking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId: userId,
          status: "confirmed",
        },
        include: {
          event: true,
        },
      });

      if (!existingBooking) {
        console.error(
          `Booking not found for bookingId ${bookingId} and userId ${userId}`
        );
        return {
          success: false,
          message: "Booking not found or already cancelled",
          data: null,
        };
      }

      // Update ticket slots based on the type of ticket purchased
      if (existingBooking.ticketType === "single") {
        // Check if a single ticket exists before updating
        const existingSingleTicket = await prisma.singleTicket.findUnique({
          where: {
            id: existingBooking.eventId,
          },
        });

        if (existingSingleTicket) {
          // Update single ticket slots if found
          await prisma.singleTicket.update({
            where: {
              id: existingBooking.eventId,
            },
            data: {
              slots: {
                increment: existingBooking.singleTicketSlots,
              },
            },
          });
        } else {
          console.warn(
            `Single ticket not found for eventId ${existingBooking.eventId}`
          );
        }
      } else if (existingBooking.ticketType === "group") {
        // Check if a group ticket exists before updating
        const existingGroupTicket = await prisma.groupTicket.findUnique({
          where: {
            id: existingBooking.eventId,
          },
        });

        if (existingGroupTicket) {
          // Update group ticket slots if found
          await prisma.groupTicket.update({
            where: {
              id: existingBooking.eventId,
            },
            data: {
              slots: {
                increment: existingBooking.groupTicketSlots,
              },
            },
          });
        } else {
          console.warn(
            `Group ticket not found for eventId ${existingBooking.eventId}`
          );
        }
      }

      // Mark the booking as cancelled
      const cancelledBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          canCancel: false,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Booking cancellation requested successfully",
        data: cancelledBooking,
      };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return {
        success: false,
        message: "An error occurred while cancelling booking",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}
