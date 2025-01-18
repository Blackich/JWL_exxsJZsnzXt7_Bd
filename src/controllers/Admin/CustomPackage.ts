import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getCustomPackageDetailsById = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT * FROM Custom_package_detail
        WHERE id = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);

export const getCustomPackageDetails = tryCatch(
  async (req: Request, res: Response) => {
    db.query(`SELECT * FROM Custom_package_detail`, (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    });
  },
);

export const createCustomPackage = tryCatch(
  async (req: Request, res: Response) => {
    const cpData = req.body;

    db.query(
      `INSERT INTO Custom_package_detail (id, likes, reach,
        saves, profileVisits, reposts, videoViews,
        countPosts, price_rub, price_usd, createdAt)
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cpData.likes,
        cpData.reach,
        cpData.saves,
        cpData.profileVisits,
        cpData.reposts,
        cpData.videoViews,
        cpData.countPosts,
        cpData.price_rub,
        cpData.price_usd,
      ],
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(201).json({
          message: "Custom package has been created",
        });
      },
    );
  },
);

export const addCustomPackToUser = tryCatch(
  async (req: Request, res: Response) => {
    const { userId, customPackageId } = req.body;
    const status = await checkСustomPackExistAndUserStatus(userId);

    if (!status) {
      db.query(
        `INSERT INTO Custom_package_user (userId,
          customPackageId, createdAt)
          VALUES (${userId}, ${customPackageId}, NOW())`,
        (err, result) => {
          if (err) return dbError(err, res);
          const data = result;
          return res.status(200).json(data);
        },
      );
    } else {
      return res.status(409).json({
        message: "User already has a custom package or inactive",
      });
    }
  },
);

export const getAllUsersForCustomPackage = tryCatch(
  async (req: Request, res: Response) => {
    const users = await getUsersForCustomPackage();
    return res.status(200).json(users);
  },
);

//--------------------------------------------------

const checkСustomPackExistAndUserStatus = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT u.id, cpu.customPackageId
        FROM Users u, Custom_package_user cpu
        WHERE u.id = cpu.userId
        AND u.id = ${id}
        AND u.status = 1`,
    )
    .then(([result]) => (result as RowDataPacket[])[0]);
};

const getUsersForCustomPackage = async () => {
  return await db
    .promise()
    .query(`SELECT id FROM Users`)
    .then(([result]) => (result as { id: number }[]).map((user) => user.id));
};
