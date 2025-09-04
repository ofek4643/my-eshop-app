import nodemailer from "nodemailer";

// פונקציה כללית לשליחת מיילים
export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"EShop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
