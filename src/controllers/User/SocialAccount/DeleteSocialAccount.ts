import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

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
