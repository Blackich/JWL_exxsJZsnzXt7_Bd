import { db } from "@src/main";
import { Request, Response } from "express";
import { getExtraServiceStatusById } from "./Entity/queries";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getExtraServicesStatus = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT ex.serviceName, exsd.extraServiceId, exsd.status
        From Extra_service_detail exsd, Extra_service ex
        WHERE ex.id = exsd.extraServiceId`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);

export const changeStatusExtraServiceById = tryCatch(
  async (req: Request, res: Response) => {
    const { extraServiceId } = req.body;
    const status = await getExtraServiceStatusById(extraServiceId);
    if (typeof status !== "number") return;

    db.query(
      `UPDATE Extra_service_detail
        SET status = ${status === 1 ? 0 : 1}
        WHERE extraServiceId = ${extraServiceId}`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({
          message: `Status has been updated (${status === 1 ? "off" : "on"})`,
        });
      },
    );
  },
);
