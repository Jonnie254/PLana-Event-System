import path from "path";
import ejs from "ejs";
import { sendMail } from "../bg-services/helpermail";
import { PrismaClient, Booking, User } from "@prisma/client";

const prisma = new PrismaClient();

const sendBookingEmail = async (bookingDetails: Booking) => {
  try {
    // Fetch user details including email and associated event details
    const bookingWithRelations = await prisma.booking.findUnique({
      where: {
        id: bookingDetails.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        event: {
          select: {
            name: true,
            location: true,
            date: true,
            eventTime: true,
            image: true,
          },
        },
      },
    });

    if (!bookingWithRelations) {
      throw new Error("Booking details not found");
    }

    const { user, event } = bookingWithRelations;

    const {
      location: eventLocation,
      date: eventDate,
      eventTime,
      image: eventImage,
    } = event;

    const { ticketType, createdAt } = bookingDetails;

    const templatePath = path.join(
      __dirname,
      "../../templates/booking.info.ejs"
    );
    // Render the template
    const html = await ejs.renderFile(templatePath, {
      eventName: event.name,
      eventLocation,
      eventDate: eventDate.toISOString(),
      eventImage,
      eventTime,
      ticketType,
      createdAt: createdAt.toISOString(),
    });

    // Email message options
    const messageOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Booking Confirmation",
      html: html,
    };

    // Send the email
    await sendMail(messageOptions);
    console.log("Booking confirmation email sent to:", user.email);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error("Failed to send booking confirmation email");
  } finally {
    await prisma.$disconnect();
  }
};

export { sendBookingEmail };
