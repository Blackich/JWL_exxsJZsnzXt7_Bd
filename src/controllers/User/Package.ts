import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getPackagesUser = tryCatch(async (req: Request, res: Response) => {
  db.query(`SELECT * FROM Package`, (err, result) => {
    if (err) return dbError(err, res);
    const data = result;
    return res.status(200).json(data);
  });
});

export const getCustomPackByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT cp.id, cp.likes, cp.videoViews,
      cp.countPosts, cp.price_rub, cp.price_usd
        FROM Custom_package cp, Custom_package_user cpu
        WHERE cp.id = cpu.customPackageId
        AND cpu.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
