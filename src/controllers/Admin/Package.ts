import { db } from "@src/main";
import { getServicesVR } from "@controllers/Services/Venro";
import { getServicesJP } from "@controllers/Services/JustPanel";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";

export const getPackages = tryCatch(async (req: Request, res: Response) => {
  db.query(`SELECT * FROM Package`, (err, result) => {
    if (err) return dbError(err, res);
    const data = result;
    return res.status(200).json(data);
  });
});

export const getPackageSettingsWithPrice = tryCatch(
  async (req: Request, res: Response) => {
    const servicesVR = await getServicesVR();
    const servicesJP = await getServicesJP();

    db.query(
      `SELECT * FROM Package_setting
        WHERE status = 1`,
      (err, result: RowDataPacket[]) => {
        if (err) return dbError(err, res);
        const dbData = result;

        const addPriceVR = dbData
          .filter((pack) => pack.siteId === 1)
          .map((db_item) => {
            const externalItems = servicesVR.find(
              (ext_item: { ID: number }) =>
                Number(ext_item.ID) === db_item.serviceId,
            );
            return {
              ...db_item,
              price: externalItems.cost,
            };
          });

        const addPriceJP = dbData
          .filter((pack) => pack.siteId === 2)
          .map((db_item) => {
            const externalItems = servicesJP.find(
              (ext_item: { service: number }) =>
                Number(ext_item.service) === db_item.serviceId,
            );
            return {
              ...db_item,
              price: Number(externalItems.rate),
            };
          });

        const data = addPriceVR.concat(addPriceJP);

        res.status(200).json(data);
      },
    );
  },
);
