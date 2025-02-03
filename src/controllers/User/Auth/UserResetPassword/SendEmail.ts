import { isString } from "@src/utils/utils";
import { Request, Response } from "express";
import { getUserTokens } from "../Entity/utils";
import { tryCatch } from "@src/middleware/errorHandler";
import { sentPassResetEmail } from "@src/utils/smtp/PasswordResetMail";
import {
  checkRecaptchaToken,
  checkTimeForResetPass,
  getUserCredentialsByEmail,
  insertRequestResetPassByUserId,
} from "../Entity/queries";

export const sendPasswordResetEmail = tryCatch(
  async (req: Request, res: Response) => {
    const { email, reCaptcha, lang } = req.body;

    if (!reCaptcha || !isString(reCaptcha))
      return res
        .status(400)
        .json({ codeErr: 2, message: "reCaptcha is required" });

    const recaptchaResponse = await checkRecaptchaToken(reCaptcha);
    if (!recaptchaResponse?.success)
      return res
        .status(400)
        .json({ codeErr: 3, message: "reCaptcha is invalid" });

    const userCred = await getUserCredentialsByEmail(email);
    if (userCred === null)
      return res.status(400).json({ codeErr: 1, message: "Incorrect email" });

    const timeForResetPass = await checkTimeForResetPass(userCred.id);
    if (timeForResetPass)
      return res.status(400).json({
        codeErr: 4,
        message: "You can reset password once every 30 minutes",
      });

    const { resetPassToken } = getUserTokens(userCred.id, userCred.email);

    const base64url = Buffer.from(resetPassToken).toString("base64url");

    await sentPassResetEmail(email, base64url, lang).catch(() => null);
    await insertRequestResetPassByUserId(userCred.id);

    return res.status(200).json({ message: "Reset password email sent" });
  },
);
