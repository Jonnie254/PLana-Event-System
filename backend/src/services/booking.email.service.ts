import path from "path";
import ejs from "ejs";
import { sendMail } from "../bg-services/helpermail";
import { PrismaClient, Booking } from "@prisma/client";

const prisma = new PrismaClient();

const sendBookingEmail = async (bookingDetails: Booking) => {
  try {
    const bookingWithRelations = await prisma.booking.findUnique({
      where: {
        id: bookingDetails.id,
      },
      include: {
        user: true, // Include all user fields
        event: {
          include: {
            singleTickets: true,
            groupTickets: true,
          },
        },
      },
    });

    if (!bookingWithRelations) {
      throw new Error("Booking details not found");
    }

    const { user, event } = bookingWithRelations;
    const { singleTicketSlots, groupTicketSlots } = bookingDetails;

    const totalSingleTicketPrice =
      singleTicketSlots * event.singleTickets[0].price;
    const totalGroupTicketPrice =
      groupTicketSlots * event.groupTickets[0].price;

    const totalPrice = totalSingleTicketPrice + totalGroupTicketPrice;

    const templatePath = path.join(
      __dirname,
      "../../templates/booking.info.ejs"
    );

    // Render the template
    const html = await ejs.renderFile(templatePath, {
      eventName: event.name,
      eventLocation: event.location,
      eventDate: event.date,
      eventImage: event.image,
      eventTime: event.eventTime,
      singleTicketQuantity: singleTicketSlots,
      singleTicketPrice: event.singleTickets[0].price,
      groupTicketQuantity: groupTicketSlots,
      groupTicketPrice: event.groupTickets[0].price,
      totalPrice: totalPrice,
    });

    // Email message options
    const messageOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Booking Confirmation",
      html: html,
    };

    // Function to send email with retry mechanism
    const sendEmailWithRetry = async (options: any, retries = 3) => {
      while (retries > 0) {
        try {
          await sendMail(options);
          console.log("Booking confirmation email sent to:", user.email);
          return;
        } catch (error) {
          console.error(
            `Error sending booking confirmation email (retry ${4 - retries}):`,
            error
          );
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      throw new Error(
        "Failed to send booking confirmation email after retries."
      );
    };

    // Send the email with retry mechanism
    await sendEmailWithRetry(messageOptions);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error("Failed to send booking confirmation email");
  } finally {
    await prisma.$disconnect();
  }
};

export { sendBookingEmail };
