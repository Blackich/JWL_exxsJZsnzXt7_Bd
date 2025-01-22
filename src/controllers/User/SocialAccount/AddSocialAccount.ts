import { Request, Response } from "express";
import { isNumber } from "@src/utils/utils";
import { tryCatch } from "@src/middleware/errorHandler";
import {
  addInstAccountToUser,
  checkCountInstAccByUserId,
  checkUniqueInstAcc,
  setActiveStatusInstAcc,
} from "./Entity/queries";

export const addInstAccount = tryCatch(async (req: Request, res: Response) => {
  const { id, username, instProfileId } = req.body;
  if (!id || !username)
    return res.status(400).json({ message: "Missing required fields" });

  const socialInstAccount = await checkUniqueInstAcc(id, username);
  if (socialInstAccount) {
    if (socialInstAccount.status === 0) {
      await setActiveStatusInstAcc(id, username);
      return res.status(201).json({ message: "Account has been activated" });
    }
    if (socialInstAccount.status === 1) {
      return res
        .status(400)
        .json({ codeErr: 2, message: "Account is already exists" });
    }
  }

  const countInstAccounts = await checkCountInstAccByUserId(id);
  if (isNumber(countInstAccounts)) {
    if (countInstAccounts <= 10) {
      await addInstAccountToUser(id, username, instProfileId);
      return res.status(201).json({ message: "Account has been added" });
    }
    return res
      .status(400)
      .json({ codeErr: 1, message: "You can't add more accounts" });
  }

  return res.status(400).json({ message: "Smth went wrong" });
});
