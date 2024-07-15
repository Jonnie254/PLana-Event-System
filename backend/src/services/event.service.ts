import { PrismaClient } from "@prisma/client";
import { Event } from "../interfaces/Event";
import { Res } from "../interfaces/Res";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export class EventService {
  // Function to create an event
  async createEvent(newEvent: Event): Promise<Res> {
    try {
      const {
        name,
        image,
        description,
        date,
        location,
        eventTime,
        createdById,
        groupTickets,
        singleTickets,
      } = newEvent;

      const eventId = uuidv4();

      const eventData: any = {
        id: eventId,
        name,
        image,
        description,
        date,
        location,
        eventTime,
        createdBy: { connect: { id: createdById } },
      };

      // Check if singleTickets exist and create them
      if (singleTickets && singleTickets.length > 0) {
        eventData.singleTickets = {
          createMany: {
            data: singleTickets.map((ticket) => ({
              id: uuidv4(),
              slots: ticket.slots,
              price: ticket.price,
            })),
          },
        };
      }

      // Check if groupTickets exist and create them
      if (groupTickets && groupTickets.length > 0) {
        eventData.groupTickets = {
          createMany: {
            data: groupTickets.map((ticket) => ({
              id: uuidv4(),
              slots: ticket.slots,
              price: ticket.price,
            })),
          },
        };
      }

      const event = await prisma.event.create({
        data: eventData,
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      return {
        success: true,
        message: "Event created successfully",
        data: event,
      };
    } catch (error: any) {
      console.error("Error creating event:", error);
      return {
        success: false,
        message: "An error occurred while creating event",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to get all events
  async getAllEvents(): Promise<Res> {
    try {
      const events = await prisma.event.findMany({
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      return {
        success: true,
        message: "Events retrieved successfully",
        data: events,
      };
    } catch (error: any) {
      console.error("Error getting events:", error);
      return {
        success: false,
        message: "An error occurred while getting events",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to get an event by ID
  async getEventById(event_id: string): Promise<Res> {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: event_id,
        },
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      return {
        success: true,
        message: "Event retrieved successfully",
        data: event,
      };
    } catch (error: any) {
      console.error("Error getting event:", error);
      return {
        success: false,
        message: "An error occurred while getting event",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  //function to get event by specific planner
  async getEventByPlanner(planner_id: string): Promise<Res> {
    try {
      const events = await prisma.event.findMany({
        where: {
          createdById: planner_id,
        },
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      return {
        success: true,
        message: "Events retrieved successfully",
        data: events,
      };
    } catch (error: any) {
      console.error("Error getting events:", error);
      return {
        success: false,
        message: "An error occurred while getting events",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  // Function to update an event
  async updateEvent(
    event_id: string,
    updatedEvent: Event,
    creatorId?: string
  ): Promise<Res> {
    try {
      const {
        name,
        image,
        description,
        date,
        location,
        groupTickets,
        singleTickets,
      } = updatedEvent;

      const eventData: any = {
        name,
        image,
        description,
        date,
        location,
      };

      // Only include createdBy if it exists in the updatedEvent
      if (updatedEvent.createdById) {
        eventData.createdById = updatedEvent.createdById;
      } else if (creatorId) {
        eventData.createdById = creatorId;
      }

      // Prepare to update singleTickets
      const singleTicketsData = singleTickets?.map((ticket) => ({
        where: { id: ticket.id }, // Assuming each single ticket has an ID
        data: {
          slots: ticket.slots,
          price: ticket.price,
        },
      }));

      // Prepare to update groupTickets
      const groupTicketsData = groupTickets?.map((ticket) => ({
        where: { id: ticket.id }, // Assuming each group ticket has an ID
        data: {
          slots: ticket.slots,
          price: ticket.price,
        },
      }));

      const event = await prisma.event.update({
        where: {
          id: event_id,
        },
        data: {
          ...eventData,
          // Update singleTickets and groupTickets using nested updates
          singleTickets: {
            updateMany: singleTicketsData,
          },
          groupTickets: {
            updateMany: groupTicketsData,
          },
        },
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      return {
        success: true,
        message: "Event updated successfully",
        data: event,
      };
    } catch (error: any) {
      console.error("Error updating event:", error);
      if (error.code === "P2025") {
        return {
          success: false,
          message: "Event not found or could not be updated",
          data: null,
        };
      } else {
        return {
          success: false,
          message: "An error occurred while updating event",
          data: null,
        };
      }
    } finally {
      await prisma.$disconnect();
    }
  }
}
