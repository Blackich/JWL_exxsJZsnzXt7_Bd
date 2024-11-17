import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

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
        saves, profileVisits, shares, videoViews,
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
