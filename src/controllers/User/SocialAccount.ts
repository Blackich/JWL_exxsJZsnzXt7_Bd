import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";
import { logger } from "@src/utils/logger/logger";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

export const getSocialList = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;

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
  const countActiveInstAcc = await checkCountInstAccByUserId(id);
  const countAllInstAcc = await checkCountAllInstAccUser(id);
  const uniqueActiveInstAcc = await checkUniqueActiveInstAcc(id, username);
  const uniqueInactiveInstAcc = await checkUniqueInactiveInstAcc(id, username);

  if (!uniqueActiveInstAcc)
    return res
      .status(400)
      .json({ codeErr: 2, message: "Username already exists" });

  if (countAllInstAcc >= 10)
    return res
      .status(400)
      .json({ codeErr: 3, message: "You can't add more accounts" });

  if (!uniqueInactiveInstAcc && countActiveInstAcc <= 4) {
    await setActiveStatusInstAcc(id, username);
    return res.status(201).json({ message: "Account has been activated" });
  }

  if (countActiveInstAcc <= 4) {
    db.query(
      `INSERT INTO Social_nickname (id, userId, messangerId, nickname) 
      VALUES (null, ${id}, 1, '${username}')`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(201).json({ message: "Account has been added" });
      },
    );
  } else {
    return res
      .status(400)
      .json({ codeErr: 1, message: "You can't add more than 5 accounts" });
  }
});

export const deleteInstAccount = tryCatch(
  async (req: Request, res: Response) => {
    const { id, username } = req.body;

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

const checkCountInstAccByUserId = async (id: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT COUNT(*) as count
        FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1
          AND status = 1`,
    )
    .then(([result]) => {
      return (result as RowDataPacket[])[0].count;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const checkCountAllInstAccUser = async (id: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT COUNT(*) as count
        FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1`,
    )
    .then(([result]) => {
      return (result as RowDataPacket[])[0].count;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const checkUniqueActiveInstAcc = async (id: number, username: string) => {
  const data = await db
    .promise()
    .query(
      `SELECT * FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1
          AND status = 1
          AND nickname = '${username}'`,
    )
    .then(([result]) => {
      return (result as RowDataPacket[]).length > 0 ? false : true;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const checkUniqueInactiveInstAcc = async (
  id: number,
  username: string,
) => {
  const data = await db
    .promise()
    .query(
      `SELECT * FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1
          AND status = 0
          AND nickname = '${username}'`,
    )
    .then(([result]) => {
      return (result as RowDataPacket[]).length > 0 ? false : true;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const setActiveStatusInstAcc = async (id: number, username: string) => {
  const data = await db
    .promise()
    .query(
      `UPDATE Social_nickname
        SET status = 1
        WHERE userId = ${id}
          AND messangerId = 1 
          AND nickname = '${username}'`,
    )
    .then(([result]) => {
      return result as RowDataPacket[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
