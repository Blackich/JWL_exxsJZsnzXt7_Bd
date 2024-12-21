import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";

export const getServiceList = tryCatch(async (req: Request, res: Response) => {
  db.query(
    `SELECT s.id, s.userId, em.fullName, sn.nickname, 
		    s.packageId, p.likes as packageLikes,
        s.customPackageId, cp.likes as customLikes,
		    s.countPosts, s.orderId, s.status, s.createdAt,
        s.cost, s.currency, s.paymentServiceName
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
});

export const getServiceById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    `SELECT s.id, s.userId, em.fullName, sn.nickname, 
		    s.packageId, p.likes as packageLikes,
        s.customPackageId, cp.likes as customLikes,
		    s.countPosts, s.orderId, s.status, s.createdAt,
        s.cost, s.currency, s.paymentServiceName
          FROM Service s
          LEFT JOIN Package p ON p.id = s.packageId
          LEFT JOIN Custom_package cp ON cp.id = s.customPackageId
          LEFT JOIN Social_nickname sn ON sn.id = s.socialNicknameId
          LEFT JOIN Users u ON u.id = s.userId
          LEFT JOIN Employees em ON em.id = u.invitedEmployeeId
          WHERE s.id = ${id}`,
    (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      const data = result[0];
      return res.status(200).json(data);
    },
  );
});

export const updateServiceStatus = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    db.query(
      `SELECT status FROM Service 
      WHERE id = ${id}`,
      (err, result: RowDataPacket[]) => {
        if (err) return dbError(err, res);
        const status = result[0].status;

        db.query(
          `UPDATE Service
            SET status = ${status === 1 ? 0 : 1}
            WHERE id = ${id}`,
          (err, _) => {
            if (err) return dbError(err, res);
            return res.status(200).json({
              message: "Service status has been updated",
            });
          },
        );
      },
    );
  },
);

export const getPurchasedServiceById = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT pp.*, ps.typeService
        FROM Purchase_package pp, Package_setting ps
        WHERE pp.siteServiceId = ps.serviceId
          AND pp.serviceId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
