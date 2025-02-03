import { serialize } from "cookie";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import { getFullUserCredentialsByEmail } from "./Entity/queries";
import {
  getUserTokens,
  hashPassword,
  comparePassword,
  preValidationUserData,
  refreshTokenExpiresIn,
} from "./Entity/utils";

export const loginUser = tryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!preValidationUserData(email, password))
    return res
      .status(400)
      .json({ codeErr: 1, message: "Email or password are invalid" });

  const userCred = await getFullUserCredentialsByEmail(email);
  if (userCred === null)
    return res
      .status(400)
      .json({ codeErr: 3, message: "Incorrect email/password" });

  const hashedToken = await hashPassword(password);
  if (!hashedToken)
    return res
      .status(400)
      .json({ codeErr: 99, message: "Something went wrong" });

  const isPasswordEquals = await comparePassword(password, userCred.password);
  if (!isPasswordEquals)
    return res
      .status(400)
      .json({ codeErr: 3, message: "Incorrect email/password" });

  const { accessToken, refreshToken } = getUserTokens(
    userCred.id,
    userCred.email,
  );

  res.setHeader(
    "Set-Cookie",
    serialize("refresh-Token", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn,
      path: "/",
    }),
  );

  return res.status(200).json({
    id: userCred.id,
    email: userCred.email,
    accessToken,
  });
});
