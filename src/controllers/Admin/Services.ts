import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getServiceList = tryCatch(async (req: Request, res: Response) => {
  db.query(
    `SELECT s.id, s.userId, sn.nickname, 
		    s.packageId, pd.likes as packageLikes,
        s.customPackageId, cpd.likes as customLikes,
		    s.countPosts, s.orderId, s.status, s.createdAt,
        s.cost, s.currency, s.paymentServiceName
          FROM Service s
          LEFT JOIN Package_detail pd ON pd.id = s.packageId
          LEFT JOIN Custom_package_detail cpd ON cpd.id = s.customPackageId
          LEFT JOIN Social_nickname sn ON sn.id = s.socialNicknameId
          LEFT JOIN Users u ON u.id = s.userId`,
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
    `SELECT s.id, s.userId, sn.nickname, 
		    s.packageId, pd.likes as packageLikes,
        s.customPackageId, cpd.likes as customLikes,
		    s.countPosts, s.orderId, s.status, s.createdAt,
        s.cost, s.currency, s.paymentServiceName
          FROM Service s
          LEFT JOIN Package_detail pd ON pd.id = s.packageId
          LEFT JOIN Custom_package_detail cpd ON cpd.id = s.customPackageId
          LEFT JOIN Social_nickname sn ON sn.id = s.socialNicknameId
          LEFT JOIN Users u ON u.id = s.userId
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
