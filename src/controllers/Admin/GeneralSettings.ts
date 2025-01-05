import { db } from "@src/main";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getGeneralSettings = tryCatch(
  async (req: Request, res: Response) => {
    db.query(`SELECT * FROM General_setting`, (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    });
  },
);

export const changeStatusGenSettingById = tryCatch(
  async (req: Request, res: Response) => {
    const { settingId } = req.body;
    const status = await getGenSettingStatusById(settingId);
    if (typeof status !== "number") return;

    db.query(
      `UPDATE General_setting
        SET status = ${status === 1 ? 0 : 1}
        WHERE id = ${settingId}`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({
          message: `Status has been updated (${status === 1 ? "off" : "on"})`,
        });
      },
    );
  },
);

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

//--------------------------------------------------

const getGenSettingStatusById = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT status
        FROM General_setting
        WHERE id = ${id}`,
    )
    .then(([result]) => {
      return (result as { status: number }[])[0].status;
    })
    .catch((err) => logger.error(err.stack));
};

const getExtraServiceStatusById = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT status
        FROM Extra_service_detail
        WHERE extraServiceId = ${id}`,
    )
    .then(([result]) => {
      return (result as { status: number }[])[0].status;
    })
    .catch((err) => logger.error(err.stack));
};
