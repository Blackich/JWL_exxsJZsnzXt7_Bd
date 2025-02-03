import { Response } from "express";
import { isString } from "@src/utils/utils";
import { hashPassword } from "../Entity/utils";
import { ResetPasscRequest } from "./middleware";
import { tryCatch } from "@src/middleware/errorHandler";
import {
  getUserCredentialsById,
  updateStatusPassChangeByUserId,
  updateUserPassword,
} from "../Entity/queries";

export const changePasswordUser = tryCatch(
  async (req: ResetPasscRequest, res: Response) => {
    const { password } = req.body;
    const userId = req.userId;

    if (
      !password ||
      !isString(password) ||
      password.includes(" ") ||
      password.length < 5 ||
      password.length > 30
    )
      return res.status(400).json({ codeErr: 3, message: "Password invalid" });

    if (!userId)
      return res.status(400).json({ codeErr: 98, message: "User not found" });

    const userCred = await getUserCredentialsById(userId);
    if (userCred === null)
      return res.status(400).json({ codeErr: 98, message: "User not found" });

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword)
      return res.status(400).json({ message: "Something went wrong" });

    const updatePassword = await updateUserPassword(
      userCred.id,
      hashedPassword,
    );
    if (!updatePassword)
      return res
        .status(400)
        .json({ message: "Password not updated, try again later" });

    await updateStatusPassChangeByUserId(userCred.id);

    return res.status(200).json({ message: "Password updated" });
  },
);
