import { PrismaClient } from "@prisma/client";
import { Res } from "../interfaces/Res";
import { error } from "console";

export class AnalyticsService {
  prisma = new PrismaClient();

  async getAllBookings(): Promise<Res> {
    try {
      const bookings = await this.prisma.booking.findMany({
        include: {
          event: true,
        },
      });
      return {
        success: true,
        message: "All bookings",
        data: bookings,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
  async totalRevenue(): Promise<Res> {
    try {
      const bookings = await this.prisma.booking.findMany({
        include: {
          event: {
            include: {
              singleTickets: true,
              groupTickets: true,
            },
          },
        },
      });

      let totalRevenue = 0;

      bookings.forEach((booking) => {
        const { ticketType, groupTicketSlots, singleTicketSlots, event } =
          booking;

        // Find the ticket prices
        const singleTicket = event.singleTickets[0];
        const groupTicket = event.groupTickets[0];

        if (ticketType === "single" && singleTicket) {
          totalRevenue += singleTicketSlots * singleTicket.price;
        } else if (ticketType === "group" && groupTicket) {
          totalRevenue += groupTicketSlots * groupTicket.price;
        }
      });

      return {
        success: true,
        message: "Total revenue calculated",
        data: totalRevenue,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
  async totalPlannerRevenue(plannerId: string): Promise<Res> {
    try {
      // Fetch bookings including event details and ticket types
      const bookings = await this.prisma.booking.findMany({
        include: {
          event: {
            include: {
              singleTickets: true,
              groupTickets: true,
            },
          },
        },
        where: {
          event: {
            createdById: plannerId, // Corrected field name to match schema
          },
        },
      });

      let totalRevenue = 0;

      // Calculate total revenue
      bookings.forEach((booking) => {
        const { ticketType, groupTicketSlots, singleTicketSlots, event } =
          booking;

        // Find the ticket prices
        const singleTicket = event.singleTickets.find((ticket) => ticket.id); // Find by ID
        const groupTicket = event.groupTickets.find((ticket) => ticket.id); // Find by ID

        if (ticketType === "single" && singleTicket) {
          totalRevenue += singleTicketSlots * singleTicket.price;
        } else if (ticketType === "group" && groupTicket) {
          totalRevenue += groupTicketSlots * groupTicket.price;
        }
      });

      return {
        success: true,
        message: "Total revenue calculated for the planner",
        data: totalRevenue,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
}
