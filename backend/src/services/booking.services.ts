import { GroupTicket, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BookingData } from "../interfaces/Event";
import { Res } from "../interfaces/Res";
import { sendBookingEmail } from "./booking.email.service";
import { bookingSchema } from "../middleware/validate.inputs";

const prisma = new PrismaClient();

export class BookingService {
  async getUserEmailById(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.email;
  }
  async createChatRoomForEvent(
    eventId: string,
    userIds: string[]
  ): Promise<Res> {
    try {
      // Check if a chat room already exists for the event
      const existingChatRoom = await prisma.chatRoom.findUnique({
        where: { id: eventId },
      });

      // Fetch the event organizer
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { createdById: true },
      });

      if (!event) {
        return {
          success: false,
          message: "Event not found",
          data: null,
        };
      }

      const organizerId = event.createdById;

      if (existingChatRoom) {
        // Fetch existing users in the chat room
        const existingChatRoomUsers = await prisma.chatRoomUser.findMany({
          where: { chatRoomId: existingChatRoom.id },
          select: { userId: true },
        });

        // Get existing user IDs
        const existingUserIds = existingChatRoomUsers.map(
          (chatRoomUser) => chatRoomUser.userId
        );

        // Combine new user IDs with the organizer ID
        const allUserIds = [...new Set([...userIds, organizerId])];

        // Determine new users to add
        const newUserIds = allUserIds.filter(
          (userId) => !existingUserIds.includes(userId)
        );

        // Add new users to the existing chat room
        if (newUserIds.length > 0) {
          await prisma.chatRoomUser.createMany({
            data: newUserIds.map((userId) => ({
              chatRoomId: existingChatRoom.id,
              userId,
            })),
          });
        }

        return {
          success: true,
          message: "Chat room already exists; new users added successfully",
          data: existingChatRoom,
        };
      }

      // Create a new chat room if it doesn't exist
      const chatRoom = await prisma.chatRoom.create({
        data: {
          id: uuidv4(),
          eventId,
        },
      });

      // Fetch admins
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: { id: true },
      });

      // Combine user IDs with admins and the event organizer
      const allUserIds = [
        ...new Set([
          ...userIds,
          organizerId,
          ...admins.map((admin) => admin.id),
        ]),
      ];

      await prisma.chatRoomUser.createMany({
        data: allUserIds.map((userId) => ({
          chatRoomId: chatRoom.id,
          userId,
        })),
      });

      return {
        success: true,
        message: "Chat room created and users added successfully",
        data: chatRoom,
      };
    } catch (error) {
      console.error("Error creating chat room:", error);
      return {
        success: false,
        message: "An error occurred while creating chat room",
        data: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  // book Event function
  async bookEvent(booking: BookingData): Promise<Res> {
    const { eventId, userId, ticketType, groupEmails } = booking;
    try {
      // Fetch event and its tickets, including the event organizer
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          singleTickets: true,
          groupTickets: true,
          createdBy: true, // Fetch the event organizer
        },
      });

      if (!event) {
        return {
          success: false,
          message: "Event not found",
          data: null,
        };
      }

      // Check if user has already booked for this event
      const existingBooking = await prisma.booking.findFirst({
        where: {
          eventId,
          userId,
          status: "confirmed",
        },
      });

      if (existingBooking) {
        return {
          success: false,
          message: "You have already booked a ticket for this event",
          data: null,
        };
      }

      // Select tickets based on the ticket type
      const tickets =
        ticketType === "single" ? event.singleTickets : event.groupTickets;
      const availableTicket = tickets.find((ticket) => ticket.slots > 0);

      if (!availableTicket) {
        return {
          success: false,
          message: "Tickets not available",
          data: null,
        };
      }

      // Handle group ticket validation
      if (ticketType === "group") {
        const groupTicket = availableTicket as GroupTicket;
        const requiredEmails = groupTicket.groupSize - 1; // Subtract one because the user's email is already known
        if (!groupEmails || groupEmails.length !== requiredEmails) {
          return {
            success: false,
            message: `You must provide ${requiredEmails} emails for a group ticket`,
            data: null,
          };
        }
      }

      // Create booking record
      const bookingRecord = await prisma.booking.create({
        data: {
          id: uuidv4(),
          ticketNumber: uuidv4(),
          event: { connect: { id: eventId } },
          user: { connect: { id: userId } },
          ticketType,
          singleTicketSlots: ticketType === "single" ? 1 : 0,
          groupTicketSlots: ticketType === "group" ? 1 : 0,
          eventLocation: event.location,
          eventDate: new Date(event.date),
          eventTime: event.eventTime,
          eventImage: event.image,
          status: "confirmed",
          canEdit: true,
          canCancel: true,
          canDelete: true,
        },
      });

      // Update ticket slots
      await (
        prisma[ticketType === "single" ? "singleTicket" : "groupTicket"] as any
      ).update({
        where: { id: availableTicket.id },
        data: { slots: availableTicket.slots - 1 },
      });

      // Create GroupTicketMember entries for group bookings
      if (ticketType === "group" && groupEmails) {
        try {
          const allEmails = [
            await this.getUserEmailById(userId),
            ...groupEmails,
          ];

          await prisma.groupTicketMember.createMany({
            data: allEmails.map((email) => ({
              id: uuidv4(),
              groupTicketId: availableTicket.id,
              email,
            })),
          });

          // Send email to each email address in groupEmails with individual error handling
          const emailResults = await Promise.allSettled(
            allEmails.map(async (email) => {
              try {
                await sendBookingEmail(bookingRecord, [email]);
                console.log(`Booking confirmation email sent to: ${email}`);
                return { email, success: true };
              } catch (error) {
                console.error(
                  `Error sending booking confirmation email to ${email}:`,
                  error
                );
                return { email, success: false, error };
              }
            })
          );

          // Log any failed email attempts
          const failedEmails = emailResults
            .filter(
              (result): result is PromiseRejectedResult =>
                result.status === "rejected"
            )
            .map((result) => result.reason);

          if (failedEmails.length > 0) {
            console.error("Some emails failed to send:", failedEmails);
            return {
              success: false,
              message: "Failed to send booking emails to some recipients",
              data: null,
            };
          }
        } catch (error) {
          console.error("Error handling group ticket members:", error);
          return {
            success: false,
            message: "Failed to handle group ticket members",
            data: null,
          };
        }
      } else {
        // Send email to the main user if it's a single ticket or no group emails
        try {
          sendBookingEmail(bookingRecord);
        } catch (error) {
          console.error("Error sending booking email:", error);
          return {
            success: false,
            message: "Failed to send booking email",
            data: null,
          };
        }
      }

      // Create or get chat room and include the event organizer
      const chatRoom = await this.createChatRoomForEvent(eventId, [
        userId,
        event.createdBy.id,
      ]);

      return {
        success: true,
        message: "Booking successful, check your email for confirmation",
        data: {
          bookingRecord,
          chatRoom,
        },
      };
    } catch (error) {
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
