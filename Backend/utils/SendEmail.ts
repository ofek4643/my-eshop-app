import nodemailer from "nodemailer";
import { google } from "googleapis";

export const createTransporter = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  let accessToken;

  try {
    accessToken = await oAuth2Client.getAccessToken();
    console.log("ACCESS TOKEN TOKEN:", accessToken?.token);
  } catch (err) {
    console.error("❌ OAuth Token Error:", err);
  }
  // כאן אנחנו משתמשים ב־host/port במקום service
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // חייב להיות true עבור 465
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken?.token,
    },
  } as any); // as any כדי לעקוף בעיות טיפוס TypeScript

  return transporter;
};

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};

