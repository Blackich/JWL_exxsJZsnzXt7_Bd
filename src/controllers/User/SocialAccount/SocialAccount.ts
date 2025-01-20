import { db } from "@src/main";
import { Request, Response } from "express";
import { isNumber } from "@src/utils/utils";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import {
  addInstAccountToUser,
  checkCountInstAccByUserId,
  checkUniqueInstAcc,
  setActiveStatusInstAcc,
} from "./Entity/queries";

export const getSocialList = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing required fields" });

  db.query(
    `SELECT id, nickname FROM Social_nickname 
      WHERE userId = ${id}
      AND messangerId = 1
      AND status = 1`,
    (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    },
  );
});

export const addInstAccount = tryCatch(async (req: Request, res: Response) => {
  const { id, username } = req.body;
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
      await addInstAccountToUser(id, username);
      return res.status(201).json({ message: "Account has been added" });
    }
    return res
      .status(400)
      .json({ codeErr: 1, message: "You can't add more accounts" });
  }

  return res.status(400).json({ message: "Smth went wrong" });
});

export const deleteInstAccount = tryCatch(
  async (req: Request, res: Response) => {
    const { id, username } = req.body;
    if (!id || !username)
      return res.status(400).json({ message: "Missing required fields" });

    db.query(
      `UPDATE Social_nickname
        SET status = 0
        WHERE userId = ${id}
          AND messangerId = 1 
          AND nickname = '${username}'`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({ message: "Account has been deleted" });
      },
    );
  },
);
