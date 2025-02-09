import { isArray } from "@src/utils/utils";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { PurchasePackage } from "@src/utils/types";
import { tryCatch } from "@src/middleware/errorHandler";
import { getAllPackageSubsByServiceId } from "./CheckStatusSubs";
import { cancelServiceVR } from "@src/controllers/Services/Venro";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";

export const cancelAllSubs = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const allSubsByServiceId = await getAllPackageSubsByServiceId(Number(id));
  if (!isArray(allSubsByServiceId))
    return res.status(400).json({ message: "Services not found" });

  return await Promise.allSettled(
    allSubsByServiceId.map(async (subscription: PurchasePackage) => {
      if (subscription.siteId === 1) {
        return await cancelServiceVR(subscription.orderId);
      }
      if (subscription.siteId === 2) {
        return await cancelServiceJP(subscription.orderId);
      }
    }),
  )
    .then(() => {
      return res.status(200).json({
        message: "All subscriptions have been canceled",
      });
    })
    .catch((err) => {
      logger.error("cancelAllSubs", { err });
      return res.status(400).json({
        message: "Something went wrong",
        error: err.message,
      });
    });
});
