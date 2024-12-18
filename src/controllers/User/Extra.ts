import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const saveCommentsBeforePayment = tryCatch(
  async (req: Request, res: Response) => {
    const { userId, socialNicknameId, comments, countComments } = req.body;

    const commentsConcat = (comments as string[])
      .map((string) => string.concat("x1Ejf7\n"))
      .join("");

    db.query(
      `INSERT INTO Extra_service_comment
        (userId, socialNicknameId, countComments, comments)
        VALUES (${userId}, ${socialNicknameId},
          ${countComments}, '${commentsConcat}')`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({ message: "Comments has been saved" });
      },
    );
  },
);
