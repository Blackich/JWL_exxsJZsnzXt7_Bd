import { Request, Response } from "express";
import { PurchasePackage } from "@src/utils/types";
import { tryCatch } from "@src/middleware/errorHandler";
import { cancelServiceVR } from "@src/controllers/Services/Venro";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";
import { getAllPackageSubsByServiceId } from "./CheckStatusSubs";

export const cancelAllSubs = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const allSubsByServiceId = await getAllPackageSubsByServiceId(Number(id));
  if (Array.isArray(allSubsByServiceId) && allSubsByServiceId.length === 0)
    return;

  const result = await Promise.allSettled(
    allSubsByServiceId.map(async (subscription: PurchasePackage) => {
      if (subscription.siteId === 1) {
        return cancelServiceVR(subscription.orderId);
      }
      if (subscription.siteId === 2) {
        return cancelServiceJP(subscription.orderId);
      }
    }),
  );

  return res.status(200).json(result);
});
