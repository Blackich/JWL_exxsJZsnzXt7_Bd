import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { logger } from "@src/utils/logger/logger";
import { RowDataPacket } from "mysql2";

export const getCustomPackageById = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT * FROM Custom_package
        WHERE id = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);

export const getCustomPackageList = tryCatch(
  async (req: Request, res: Response) => {
    db.query(`SELECT * FROM Custom_package`, (err, result) => {
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
      `INSERT INTO Custom_package (id, likes, reach,
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
    const { userId, packageId } = req.body;
    const status = await checkUserId(userId);

    if (!status) {
      db.query(
        `INSERT INTO Custom_package_user (userId,
          customPackageId, createdAt)
          VALUES (${userId}, ${packageId}, NOW())`,
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

const checkUserId = async (id: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT u.id, cpu.customPackageId
        FROM Users u, Custom_package_user cpu
        WHERE u.id = cpu.userId
        AND u.id = ${id}
        AND u.status = 'active'`,
    )
    .then(([result]) => {
      return (result as RowDataPacket[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
