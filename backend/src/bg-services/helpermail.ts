import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MailConfig } from "../interfaces/mail.config";
dotenv.config();

function createTransporter(configs: any) {
  const transporter = nodemailer.createTransport(configs);
  return transporter;
}

let mailConfigurations: MailConfig = {
  service: "gmail",
  host: "stmp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
};
export const sendMail = async (messageOptions: any) => {
  let transporter = createTransporter(mailConfigurations);
  await transporter.verify();
  await transporter.sendMail(messageOptions),
    (error: any, info: any) => {
      if (error) {
        console.log(error);
      }
      console.log(info);
    };
};
