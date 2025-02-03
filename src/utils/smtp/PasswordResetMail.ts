import { transporter } from "./TransportSetting";
import { logErr } from "@src/middleware/errorHandler";

export const sentPassResetEmail = async (
  email: string,
  base64url: string,
  lang: "ru" | "en" = "en",
) => {
  const link = `${process.env.CORS_ORIGIN}/reset-password?token=${base64url}`;
  const mailOptions = {
    from: "info@gram.top",
    to: email,
    subject: subject[lang],
    html: htmlMessage(link, lang),
  };

  return transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logErr(error, "passwordResetEmail");
    }
  });
};

const htmlMessage = (link: string, lang: string) => {
  if (lang === "ru")
    return `
    <p>Вы запросили восстановление пароля. Перейдите по ссылке ниже:</p>
    <p>Ссылка для восстановления работает в течение 15 минут.</p>
    <p><a href="${link}" style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Сменить пароль</a></p>
    <br>
    <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
    <p>С уважением, <br>Команда поддержки Gram.top</p>  
    `;

  return `
    <p>You have requested password recovery. Please follow the link below:</p>
    <p>The recovery link works for 15 minutes.</p>
    <p><a href="${link}" style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Change password</a></p>
    <br>
    <p>If you have not requested password recovery, simply ignore this email.</p>
    <p>Best regards, <br>Gram.top support team</p>  
    `;
};

const subject = {
  ru: "Восстановление пароля",
  en: "Password recovery",
};
