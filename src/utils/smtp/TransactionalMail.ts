import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.timeweb.ru",
  port: 2525,
  secure: false,
  auth: {
    user: "info@gram.top",
    pass: process.env.TIMEWEB_MAIL_PASS,
  },
});

export const sendEmailSmtp = async (message: string) => {
  const mailOptions = {
    from: "info@gram.top",
    to: process.env.TIMEWEB_MAIL,
    subject: "Подтверждение регистрации",
    text: `Текст письма: ${message}`,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Ошибка при отправке письма:", error);
      return "rere";
    } else {
      console.log("Письмо отправлено:", info.response);
    }
  });
};
