import { serialize } from "cookie";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import { getEmployeeCredentialsByLogin } from "./Entity/queries";
import {
  getAdminTokens,
  hashPassword,
  comparePassword,
  preValidationAdminData,
  refreshTokenExpiresIn,
} from "./Entity/utils";

export const loginAdmin = tryCatch(async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!preValidationAdminData(login, password))
    return res.status(400).json({ message: "Login or password are invalid" });

  const adminCred = await getEmployeeCredentialsByLogin(login);
  if (adminCred === null)
    return res.status(400).json({ message: "Incorrect email/password" });

  const hashedToken = await hashPassword(password);
  if (!hashedToken)
    return res.status(400).json({ message: "Something went wrong" });

  const isPasswordEquals = await comparePassword(password, adminCred.password);
  if (!isPasswordEquals)
    return res.status(400).json({ message: "Incorrect email/password" });

  const { accessToken, refreshToken } = getAdminTokens(
    adminCred.id,
    adminCred.login,
    adminCred.role,
  );

  res.setHeader(
    "Set-Cookie",
    serialize("refToken", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresIn,
      path: "/",
    }),
  );

  return res.status(200).json({
    employeeId: adminCred.id,
    login: adminCred.login,
    role: adminCred.role,
    token: accessToken,
  });
});
