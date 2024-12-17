import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const saveCommentsBeforePayment = tryCatch(
  async (req: Request, res: Response) => {
    const { userId, socialNicknameId, comments, countComments } = req.body;

    db.query(
      `INSERT INTO Extra_service_comment
        (userId, socialNicknameId, countComments, comments)
        VALUES (${userId}, ${socialNicknameId},
          ${countComments}, '${comments}')`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({ message: "Comments has been saved" });
      },
    );
  },
);
