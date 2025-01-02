import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { getExchangeRate } from "@src/utils/intermediateReq";

export const getPackageSettings = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT * FROM Package_setting
        WHERE status = 1`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        res.status(200).json(data);
      },
    );
  },
);

export const getExtraServiceSettings = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT * FROM Extra_service_setting
        WHERE status = 1`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        res.status(200).json(data);
      },
    );
  },
);

export const getTestServiceSettings = tryCatch(
  async (req: Request, res: Response) => {
    db.query(`SELECT * FROM Test_service_setting`, (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      res.status(200).json(data);
    });
  },
);

export const getExternalExchangeRate = tryCatch(
  async (req: Request, res: Response) => {
    const rate = await getExchangeRate();

    if (typeof rate !== "number")
      return res.status(404).json({ message: "Rate not found" });

    return res.status(200).json(rate);
  },
);

//--------------------------------------------------
