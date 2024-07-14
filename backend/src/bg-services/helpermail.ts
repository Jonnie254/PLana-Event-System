import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MailConfig } from "../interfaces/mail.config";
dotenv.config();

function createTransporter(configs: MailConfig) {
  const transporter = nodemailer.createTransport(configs);
  return transporter;
}

let mailConfigurations: MailConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
};

const transporter = createTransporter(mailConfigurations);

export const sendMail = async (messageOptions: any) => {
  try {
    await transporter.verify();

    let info = await transporter.sendMail(messageOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email");
  }
};
