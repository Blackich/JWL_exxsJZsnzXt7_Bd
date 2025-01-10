import { serialize } from "cookie";
import { Request, Response } from "express";
import { hashPassword } from "./Entity/bcrypt";
import { tryCatch } from "@src/middleware/errorHandler";
import {
  addNewUser,
  checkUserEmail,
  getUserCredentials,
} from "./Entity/queries";
import {
  getTokens,
  preValidationUserData,
  refreshTokenExpiresIn,
} from "./Entity/utils";

export const registerUser = tryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  const userCred = await getUserCredentials(email);
  if (userCred === null)
    return res
      .status(400)
      .json({ codeErr: 99, message: "Something went wrong" });

  const { accessToken, refreshToken } = getTokens(userCred.id, userCred.email);

  res.setHeader(
    "Set-Cookie",
    serialize("refresh-Token", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn,
    }),
  );

  return res.status(200).json({
    id: insertId,
    email: userCred.email,
    accessToken,
  });
});
