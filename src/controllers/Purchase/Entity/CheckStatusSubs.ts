import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { PurchasePackage } from "@src/utils/types";
import { tryCatch } from "@src/middleware/errorHandler";
import { checkServiceWQ } from "@src/controllers/Services/Wiq";
import { checkServiceVR } from "@src/controllers/Services/Venro";
import { checkServiceJP } from "@src/controllers/Services/JustPanel";

export const checkStatusAllSubs = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const allSubsByServiceId = await getAllPackageSubsByServiceId(Number(id));
    if (Array.isArray(allSubsByServiceId) && allSubsByServiceId.length === 0)
      return res.status(400).json({ message: "Services not found" });

    const result = await Promise.all(
      allSubsByServiceId.map(async (subscription: PurchasePackage) => {
        if (subscription.siteId === 1) {
          return checkServiceVR(subscription.orderId);
        }
        if (subscription.siteId === 2) {
          return checkServiceJP(subscription.orderId);
        }
      }),
    );
    return res.status(200).json(result);
  },
);

export const checkStatusForExtra = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const { siteServiceInfo }: { siteServiceInfo: [number, number, number] } =
      await getSiteServiceInfoIdByExtraId(Number(id));

    if (siteServiceInfo === null)
      return res.status(400).json({ message: "Extra not found" });

    if (siteServiceInfo[0] === 1) {
      const result = await checkServiceVR(siteServiceInfo[2]);
      return res.status(200).json(result);
    }
    if (siteServiceInfo[0] === 2) {
      const result = await checkServiceJP(siteServiceInfo[2]);
      return res.status(200).json(result);
    }
    if (siteServiceInfo[0] === 3) {
      const result = await checkServiceWQ(siteServiceInfo[2]);
      return res.status(200).json(result);
    }

    return res.status(200).json({ message: "Extra not Id" });
  },
);

//--------------------------------------------------

export const getAllPackageSubsByServiceId = async (serviceId: number) => {
  return await db
    .promise()
    .query(
      `SELECT * FROM Purchase_package
        WHERE serviceId = ${serviceId}`,
    )
    .then(([result]) => result as PurchasePackage[]);
};

export const getSiteServiceInfoIdByExtraId = async (extraId: number) => {
  return await db
    .promise()
    .query(
      `SELECT siteServiceInfo FROM Extra
        WHERE id = ${extraId}`,
    )
    .then(([result]) => (result as RowDataPacket)[0]);
};
