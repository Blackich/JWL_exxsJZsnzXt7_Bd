import { Response } from "express";
import { ResetPasscRequest } from "./middleware";
import { tryCatch } from "@src/middleware/errorHandler";
import { getUserCredentialsById } from "../Entity/queries";

export const getUserEmail = tryCatch(
  async (req: ResetPasscRequest, res: Response) => {
    const userId = req.userId;

    if (!userId)
      return res.status(400).json({ codeErr: 98, message: "User not found" });

    const userCred = await getUserCredentialsById(userId);
    if (userCred === null)
      return res.status(400).json({ codeErr: 98, message: "User not found" });

    return res.send({ email: userCred.email });
  },
);
