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
