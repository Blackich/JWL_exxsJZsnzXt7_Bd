import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getUsersPurchasedServices = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT s.id, s.userId, em.fullName, sn.nickname, 
		    s.packageId, p.likes as packageLikes,
        s.customPackageId, cp.likes as customLikes,
		    s.countPosts, s.orderId, s.status, s.createdAt,
        s.cost, s.currency
          FROM Service s
          LEFT JOIN Package p ON p.id = s.packageId
          LEFT JOIN Custom_package cp ON cp.id = s.customPackageId
          LEFT JOIN Social_nickname sn ON sn.id = s.socialNicknameId
          LEFT JOIN Users u ON u.id = s.userId
          LEFT JOIN Employees em ON em.id = u.invitedEmployeeId`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
