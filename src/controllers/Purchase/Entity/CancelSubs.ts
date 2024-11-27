import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
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

  return await Promise.allSettled(
    allSubsByServiceId.map(async (subscription: PurchasePackage) => {
      if (subscription.siteId === 1) {
        return cancelServiceVR(subscription.orderId);
      }
      if (subscription.siteId === 2) {
        return cancelServiceJP(subscription.orderId);
      }
    }),
  )
    .then(() => {
      return res.status(200).json({
        message: "All subscriptions have been canceled",
      });
    })
    .catch((err) => {
      logger.error(err.stack);
      return res.status(400).json({
        message: "Something went wrong",
        error: err.message,
      });
    });
});
