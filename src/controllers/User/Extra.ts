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

export const getPurchasedExtraByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    db.query(
      `SELECT ex.id, sn.nickname, exs.serviceName as extraServiceName,
        ex.count, ex.priceRUB, ex.priceUSD, ex.createdAt  
        FROM Extra ex, Social_nickname sn, Extra_service exs
          WHERE ex.socialNicknameId = sn.id
          AND ex.extraServiceId = exs.id
          AND ex.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
