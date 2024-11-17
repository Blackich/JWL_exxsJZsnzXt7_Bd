import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getUsersPurchasedServices = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT s.id, s.userId, sn.nickname, p.likes, 
        s.customPackage, s.orderId, s.countPosts, 
        s.status, s.createdAt, s.cost,
        s.currency, e.fullName
        FROM Service s, Social_nickname sn,
        Package p, Employees e, Users u
        WHERE s.socialNicknameId = sn.id
          AND s.packageId = p.id
          AND s.userId = u.id
          AND u.invitedEmployeeId = e.id`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
