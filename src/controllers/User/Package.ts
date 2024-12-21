import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getPackageDetailsUser = tryCatch(
  async (req: Request, res: Response) => {
    db.query(`SELECT * FROM Package_detail`, (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    });
  },
);

export const getCustomPackByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT cpd.id, cpd.likes, cpd.videoViews,
        cpd.countPosts, cpd.price_rub, cpd.price_usd
          FROM Custom_package_detail cpd, Custom_package_user cpu
          WHERE cpd.id = cpu.customPackageId
          AND cpu.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
