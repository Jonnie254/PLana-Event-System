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
              groupSize: ticket.groupSize,
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
        where: {
          isDeleted: false,
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
        eventTime,
        groupTickets,
        singleTickets,
      } = updatedEvent;

      const eventData: any = {
        name,
        image,
        description,
        date,
        eventTime,
        location,
      };

      if (creatorId) {
        eventData.createdById = creatorId;
      }

      // Fetch the current event data
      const currentEvent = await prisma.event.findUnique({
        where: { id: event_id },
        include: {
          singleTickets: true,
          groupTickets: true,
        },
      });

      if (!currentEvent) {
        throw new Error("Event not found");
      }

      // Prepare data for single tickets
      const newSingleTickets =
        singleTickets
          ?.filter((ticket) => !ticket.id)
          .map((ticket) => ({
            id: uuidv4(), // Generate UUID for new tickets
            slots: ticket.slots,
            price: ticket.price,
          })) || [];

      const updateSingleTickets =
        singleTickets
          ?.filter((ticket) => ticket.id)
          .map((ticket) => ({
            where: { id: ticket.id },
            data: {
              slots: ticket.slots,
              price: ticket.price,
            },
          })) || [];

      const deleteSingleTickets = currentEvent.singleTickets
        .filter((t) => !singleTickets?.some((ticket) => ticket.id === t.id))
        .map((t) => t.id);

      // Prepare data for group tickets
      const newGroupTickets =
        groupTickets
          ?.filter((ticket) => !ticket.id)
          .map((ticket) => ({
            id: uuidv4(), // Generate UUID for new tickets
            slots: ticket.slots,
            price: ticket.price,
            groupSize: ticket.groupSize,
          })) || [];

      const updateGroupTickets =
        groupTickets
          ?.filter((ticket) => ticket.id)
          .map((ticket) => ({
            where: { id: ticket.id },
            data: {
              slots: ticket.slots,
              price: ticket.price,
              groupSize: ticket.groupSize,
            },
          })) || [];

      const deleteGroupTickets = currentEvent.groupTickets
        .filter((t) => !groupTickets?.some((ticket) => ticket.id === t.id))
        .map((t) => t.id);

      // Perform the update
      const event = await prisma.event.update({
        where: { id: event_id },
        data: {
          ...eventData,
          singleTickets: {
            create: newSingleTickets,
            updateMany: updateSingleTickets,
            deleteMany: {
              id: {
                in: deleteSingleTickets,
              },
            },
          },
          groupTickets: {
            create: newGroupTickets,
            updateMany: updateGroupTickets,
            deleteMany: {
              id: {
                in: deleteGroupTickets,
              },
            },
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
      return {
        success: false,
        message: error.message || "An error occurred while updating event",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  //request for event promotion
  async requestEventPromotion(event_id: string, user_id: string): Promise<Res> {
    try {
      const event = await prisma.event.findUnique({
        where: { id: event_id },
      });

      if (!event) {
        return {
          success: false,
          message: "Event not found",
          data: null,
        };
      }

      const newPromotionRequest = await prisma.eventPromotion.create({
        data: {
          id: uuidv4(),
          event: { connect: { id: event_id } },
          requestedBy: { connect: { id: user_id } },
        },
      });

      return {
        success: true,
        message:
          "Event promotion requested successfully. Waiting for admin approval.",
        data: newPromotionRequest,
      };
    } catch (error: any) {
      console.error("Error requesting event promotion:", error);
      return {
        success: false,
        message: "An error occurred while requesting event promotion",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  //approve event promotion
  async approveEventPromotionById(
    promotion_id: string,
    isApproved: boolean
  ): Promise<Res> {
    try {
      // Find the event promotion record
      const promotion = await prisma.eventPromotion.findUnique({
        where: { id: promotion_id },
      });

      if (!promotion) {
        return {
          success: false,
          message: "Event promotion request not found",
          data: null,
        };
      }

      // Update the event promotion record with the approval status
      const updatedPromotion = await prisma.eventPromotion.update({
        where: { id: promotion_id },
        data: {
          isApproved: isApproved,
        },
      });

      return {
        success: true,
        message: "Event promotion request approved successfully",
        data: updatedPromotion,
      };
    } catch (error: any) {
      console.error("Error approving event promotion:", error);
      return {
        success: false,
        message: "An error occurred while approving event promotion",
        data: null,
      };
    } finally {
      await prisma.$disconnect(); // Ensure to disconnect Prisma client
    }
  }
  //get all event promotions
  async getAllEventPromotions(): Promise<Res> {
    try {
      const promotions = await prisma.eventPromotion.findMany({
        include: {
          event: true,
          requestedBy: true,
        },
      });

      return {
        success: true,
        message: "Event promotions retrieved successfully",
        data: promotions,
      };
    } catch (error: any) {
      console.error("Error getting event promotions:", error);
      return {
        success: false,
        message: "An error occurred while getting event promotions",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  //get all approved event promotion for the user
  async getAllApprovedEventPromotions(): Promise<Res> {
    try {
      const promotions = await prisma.eventPromotion.findMany({
        where: { isApproved: true },
        include: {
          event: true,
          requestedBy: true,
        },
      });

      return {
        success: true,
        message: "Approved event promotions retrieved successfully",
        data: promotions,
      };
    } catch (error: any) {
      console.error("Error getting approved event promotions:", error);
      return {
        success: false,
        message: "An error occurred while getting approved event promotions",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
  //get the available events for the user
  async getAvailableEvents(user_id: string): Promise<Res> {
    try {
      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              date: {
                gte: new Date().toISOString(),
              },
            },
            {
              NOT: {
                bookings: {
                  some: {
                    id: user_id,
                  },
                },
              },
            },
          ],
        },
        include: {
          singleTickets: true,
          groupTickets: true,
          bookings: {
            where: {
              id: user_id,
            },
            select: {
              id: true,
            },
          },
        },
      });

      // Double-check filtering on the application level
      const filteredEvents = events.filter(
        (event) => event.bookings.length === 0
      );

      return {
        success: true,
        message: "Events retrieved successfully",
        data: filteredEvents,
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
}
