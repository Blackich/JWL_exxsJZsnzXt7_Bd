import { db } from "@src/main";
import { Request, Response } from "express";
import { getGenSettingStatusById } from "./Entity/queries";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getMainSettings = tryCatch(async (req: Request, res: Response) => {
  db.query(`SELECT * FROM General_setting`, (err, result) => {
    if (err) return dbError(err, res);
    const data = result;
    return res.status(200).json(data);
  });
});

export const changeStatusMainSettingById = tryCatch(
  async (req: Request, res: Response) => {
    const { settingId } = req.body;
    const status = await getGenSettingStatusById(settingId);

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
