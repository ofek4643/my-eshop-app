import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";

export const createTransporter = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken?.token,
    },
  } as SMTPTransport.Options); // <- פה
  return transporter;
};

export const sendMail = async (to: string, subject: string, html: string) => {
  const transporter = await createTransporter();
  await transporter.sendMail({ from: process.env.MAIL_USER, to, subject, html });
};