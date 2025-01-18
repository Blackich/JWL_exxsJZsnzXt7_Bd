import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getExtraList = tryCatch(async (req: Request, res: Response) => {
  db.query(
    `SELECT ex.id, ex.userId, sn.nickname, ex.count,
      exs.serviceName as extraServiceName, ex.priceRUB,
      ex.siteServiceInfo, ex.createdAt, ex.paymentServiceName
          FROM Extra ex
          LEFT JOIN Users u ON u.id = ex.userId
          LEFT JOIN Extra_service exs ON exs.id = ex.extraServiceId
          LEFT JOIN Social_nickname sn ON sn.id = ex.socialNicknameId`,
    (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    },
  );
});

export const getExtraById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    `SELECT ex.id, ex.userId, sn.nickname, ex.count,
      ex.extraServiceId, exs.serviceName as extraServiceName,
      ex.priceRUB, ex.priceUSD, ex.siteServiceInfo,
      ex.paymentOrderId, ex.createdAt, ex.paymentServiceName
          FROM Extra ex
          LEFT JOIN Users u ON u.id = ex.userId
          LEFT JOIN Extra_service exs ON exs.id = ex.extraServiceId
          LEFT JOIN Social_nickname sn ON sn.id = ex.socialNicknameId
          WHERE ex.id = ${id}`,
    (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      const data = result[0];
      return res.status(200).json(data);
    },
  );
});

export const getExtraDetails = tryCatch(async (req: Request, res: Response) => {
  db.query(
    `SELECT exsd.id, exsd.extraServiceId, exs.serviceName,
      exsd.price_usd_1k, exsd.price_rub_1k
        FROM Extra_service_detail exsd
        LEFT JOIN Extra_service exs ON exs.id = exsd.extraServiceId`,
    (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    },
  );
});
