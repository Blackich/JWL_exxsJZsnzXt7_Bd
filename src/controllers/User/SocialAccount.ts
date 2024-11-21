import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getSocialList = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  db.query(
    `SELECT id, nickname FROM Social_nickname 
      WHERE userId = ${id}
      AND messangerId = 1`,
    (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    },
  );
});

export const addInstAccount = tryCatch(async (req: Request, res: Response) => {
  const { id, username } = req.body;

  db.query(
    `INSERT INTO Social_nickname (id, userId, messangerId, nickname) 
      VALUES (null, ${id}, 1, '${username}')`,
    (err, _) => {
      if (err) return dbError(err, res);
      return res.status(201).json({ message: "Account has been added" });
    },
  );
});

export const deleteInstAccount = tryCatch(
  async (req: Request, res: Response) => {
    const { id, username } = req.body;

    db.query(
      `DELETE FROM Social_nickname 
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
