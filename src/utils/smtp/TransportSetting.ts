import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.timeweb.ru",
  port: 465,
  secure: true,
  auth: {
    user: "info@gram.top",
    pass: process.env.TIMEWEB_MAIL_PASS,
  },
});
