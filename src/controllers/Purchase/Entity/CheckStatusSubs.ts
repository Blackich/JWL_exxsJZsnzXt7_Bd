import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { PurchasePackage } from "@src/utils/types";
import { tryCatch } from "@src/middleware/errorHandler";
import { checkServiceVR } from "@src/controllers/Services/Venro";
import { checkServiceJP } from "@src/controllers/Services/JustPanel";

export const checkStatusAllSubs = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const allSubsByServiceId = await getAllPackageSubsByServiceId(Number(id));
    if (Array.isArray(allSubsByServiceId) && allSubsByServiceId.length === 0)
      return;

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

export const checkStatusVRLikes = () =>
  tryCatch(async (req: Request, res: Response) => {
    const allSubsByServiceId = await getAllPackageSubsByServiceId(30);
    if (Array.isArray(allSubsByServiceId) && allSubsByServiceId.length === 0)
      return;

    const subVRLike = allSubsByServiceId.find(
      (subscription: PurchasePackage) =>
        subscription.siteId === 1 && subscription.siteServiceId === 13,
    );
    if (!subVRLike) return;
    const result = await checkServiceVR(subVRLike.orderId);

    res.status(200).json(result);
  });

//--------------------------------------------------

export const getAllPackageSubsByServiceId = async (serviceId: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT * FROM Purchase_package
        WHERE serviceId = ${serviceId}`,
    )
    .then(([result]) => {
      return result as RowDataPacket;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
