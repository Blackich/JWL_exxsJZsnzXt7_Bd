import { serialize } from "cookie";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";

export const logoutAdmin = tryCatch(async (req: Request, res: Response) => {
  res.setHeader(
    "Set-Cookie",
    serialize("refToken", "", {
      httpOnly: true,
      maxAge: 0,
    }),
  );
  return res.status(200).json({ message: "Logout successful" });
});
