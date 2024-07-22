import path from "path";
import ejs from "ejs";
import { sendMail } from "../bg-services/helpermail";
import { PrismaClient, Booking } from "@prisma/client";
import qrCode from "qrcode";
import fs from "fs";
import e from "express";

const prisma = new PrismaClient();
// Function to send booking confirmation email
const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(data);
    return qrCodeDataUrl.split(",")[1]; // Remove the Data URL prefix
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

const sendBookingEmail = async (
  bookingDetails: Booking,
  groupEmails?: string[]
) => {
  try {
    const bookingWithRelations = await prisma.booking.findUnique({
      where: { id: bookingDetails.id },
      include: {
        user: true,
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

    const qrCodeData = JSON.stringify({
      bookingId: bookingDetails.id,
      userId: user.id,
      eventId: event.id,
    });

    const qrCodeBase64 = await generateQRCode(qrCodeData);

    const templatePath = path.join(
      __dirname,
      "../../templates/booking.info.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      eventName: event.name,
      eventLocation: event.location,
      eventDate: event.date,
      eventImage: event.image,
      eventTime: event.eventTime,
      qrCodeBase64: qrCodeBase64,
      bookingDetails: bookingDetails, // Pass booking details to the template
    });

    const sendEmailWithRetry = async (
      email: string,
      options: any,
      retries = 3
    ) => {
      while (retries > 0) {
        try {
          await sendMail({ ...options, to: email });
          console.log("Booking confirmation email sent to:", email);
          return;
        } catch (error) {
          console.error(
            `Error sending booking confirmation email to ${email} (retry ${
              4 - retries
            }):`,
            error
          );
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      throw new Error(
        `Failed to send booking confirmation email to ${email} after retries.`
      );
    };

    const messageOptions = {
      from: process.env.EMAIL,
      subject: "Booking Confirmation",
      html: html,
    };

    if (groupEmails && groupEmails.length > 0) {
      // Send email to each group member
      await Promise.all(
        groupEmails.map((email) => sendEmailWithRetry(email, messageOptions))
      );
    } else {
      // Send email to the main user if no group emails are provided
      await sendEmailWithRetry(user.email, messageOptions);
    }
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error("Failed to send booking confirmation email");
  } finally {
    await prisma.$disconnect();
  }
};
// Function to send password reset email
const sendResetPasswordEmail = async (email: string, resetCode: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const templatePath = path.join(
      __dirname,
      "../../templates/forgot.password.ejs"
    );

    // Render the template with the reset code
    const html = await ejs.renderFile(templatePath, {
      resetCode: resetCode,
    });

    // Email message options
    const messageOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: html,
    };

    // Function to send email with retry mechanism
    const sendEmailWithRetry = async (options: any, retries = 3) => {
      while (retries > 0) {
        try {
          await sendMail(options);
          console.log("Password reset email sent to:", email);
          return;
        } catch (error) {
          console.error(
            `Error sending password reset email (retry ${4 - retries}):`,
            error
          );
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      throw new Error("Failed to send password reset email after retries.");
    };

    // Send the email with retry mechanism
    await sendEmailWithRetry(messageOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
// Function to send role request email
const sendRoleRequestEmail = async (
  user: { email: string; name: string },
  role: string
) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../../templates/role.request.ejs"
    );

    // Render the template with the user details and requested role
    const html = await ejs.renderFile(templatePath, {
      userName: user.name,
      requestedRole: role,
    });

    // Email message options
    const messageOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Role Change Request Received",
      html: html,
    };

    // Function to send email with retry mechanism
    const sendEmailWithRetry = async (options: any, retries = 1) => {
      while (retries > 0) {
        try {
          await sendMail(options);
          console.log("Role request email sent to:", user.email);
          return;
        } catch (error) {
          console.error(
            `Error sending role request email (retry ${4 - retries}):`,
            error
          );
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      throw new Error("Failed to send role request email after retries.");
    };

    // Send the email with retry mechanism
    await sendEmailWithRetry(messageOptions);
  } catch (error) {
    console.error("Error sending role request email:", error);
    throw new Error("Failed to send role request email");
  }
};
//function to send role approval email
const sendRoleApprovalEmail = async (email: string, role: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../../templates/approved.role.ejs"
    );

    // Render the template
    const html = await ejs.renderFile(templatePath, {
      role: role,
    });

    // Email message options
    const messageOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Role Change Approval",
      html: html,
    };

    // Send the email
    await sendMail(messageOptions);
    console.log("Role approval email sent to:", email);
  } catch (error) {
    console.error("Error sending role approval email:", error);
    throw new Error("Failed to send role approval email");
  }
};

export { sendRoleApprovalEmail };
export { sendRoleRequestEmail };
export { sendBookingEmail };
export { sendResetPasswordEmail };
