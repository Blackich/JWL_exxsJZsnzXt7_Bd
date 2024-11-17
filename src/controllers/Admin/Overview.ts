import axios from "axios";
import { db } from "@src/main";
import { siteJP, siteVenro } from "@src/utils/utils";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";

export const getBalanceService = async (url: string, API_KEY: string) => {
  const { data } = await axios.get(`${url}?key=${API_KEY}&action=balance`);
  return Number(data.balance);
};

export const getBalanceVenro = tryCatch(async (req: Request, res: Response) => {
  const data = await getBalanceService(siteVenro, process.env.API_KEY_VR || "");
  return res.status(200).json(data);
});

export const getBalanceJustPanel = tryCatch(
  async (req: Request, res: Response) => {
    const data = await getBalanceService(siteJP, process.env.API_KEY_JP || "");
    return res.status(200).json(data);
  },
);

export const getUsersCount = tryCatch(async (req: Request, res: Response) => {
  db.query(
    "SELECT COUNT(*) as count FROM Users",
    (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      const data = result[0].count;
      return res.status(200).json(data);
    },
  );
});

// export const getTotalSpent = tryCatch(async (req: Request, res: Response) => {
//   db.query("SELECT SUM(spent) as spent FROM Users", (err, result) => {
//     if (err) dbError(err, res);
//     const data = Number((result as any)[0].spent);
//     return res.status(200).json(data);
//   });
// });
