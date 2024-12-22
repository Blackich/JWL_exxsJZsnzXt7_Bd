import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getActiveServiceUser = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    db.query(
      `SELECT id, socialNicknameId, packageId,
        customPackageId, countPosts, createdAt
        FROM Service
          WHERE status = 1
          AND userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);