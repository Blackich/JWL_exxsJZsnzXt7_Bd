import { serialize } from "cookie";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import {
  addNewUser,
  checkRecaptchaToken,
  checkUserEmail,
  getUserCredentialsByEmail,
} from "./Entity/queries";
import {
  getTokens,
  hashPassword,
  preValidationUserData,
  refreshTokenExpiresIn,
} from "./Entity/utils";

export const registerUser = tryCatch(async (req: Request, res: Response) => {
  const { email, password, reCaptcha } = req.body;

  if (!reCaptcha || typeof reCaptcha !== "string")
    return res
      .status(400)
      .json({ codeErr: 4, message: "reCaptcha is required" });

  const recaptchaResponse = await checkRecaptchaToken(reCaptcha);
  if (!recaptchaResponse?.success)
    return res
      .status(400)
      .json({ codeErr: 5, message: "reCaptcha is invalid" });

  if (!preValidationUserData(email, password))
    return res
      .status(400)
      .json({ codeErr: 1, message: "Email or password are invalid" });

  const isEmailExists = await checkUserEmail(email);
  if (isEmailExists === true || isEmailExists === null)
    return res
      .status(400)
      .json({ codeErr: 2, message: "Email already exists" });

  const hashedToken = await hashPassword(password);
  if (!hashedToken)
    return res
      .status(400)
      .json({ codeErr: 99, message: "Something went wrong" });

  const insertId = await addNewUser(email, hashedToken);
  if (insertId === null)
    return res
      .status(400)
      .json({ codeErr: 99, message: "Something went wrong" });

  const userCred = await getUserCredentialsByEmail(email);
  if (userCred === null)
    return res.status(400).json({ codeErr: 99, message: "User not found" });

  const { accessToken, refreshToken } = getTokens(userCred.id, userCred.email);

  res.setHeader(
    "Set-Cookie",
    serialize("refresh-Token", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn,
    }),
  );

  return res.status(200).json({
    id: userCred.id,
    email: userCred.email,
    accessToken,
  });
});
