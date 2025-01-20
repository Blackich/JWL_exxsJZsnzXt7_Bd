import { Request, Response } from "express";
import { isObject } from "@src/utils/utils";
import { logger } from "@src/utils/logger/logger";
import { tryCatch } from "@src/middleware/errorHandler";
import { sendCommentsServiceJP } from "@controllers/Services/JustPanel";
import {
  getSettingsByExtraServiceId,
  updateSiteOrderIdForExtraService,
} from "./PurchaseExtra";

export const sendExtraComments = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { extraServiceId, comments, link } = req.body;

    try {
      const setting = await getSettingsByExtraServiceId(extraServiceId);
      if (!isObject(setting)) return;

      return await sendCommentsServiceJP(link, setting.serviceId, comments)
        .then(async (response) => {
          console.log(response, "resp Extra Comments JP");
          if (!response.order) throw new Error("Order not created");
          return await updateSiteOrderIdForExtraService(
            Number(id),
            setting.siteId,
            setting.serviceId,
            response.order,
          ).then(() => res.status(200).json({ message: "Comments sent" }));
        })
        .catch((err) => {
          logger.error("sendCommentsServiceJP", { err });
          return res.status(400).json({ message: "Comments not sent" });
        });
    } catch (err) {
      logger.error("sendExtraComments", { err });
    }
  },
);
