import { Request, Response } from "express";
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
      if (!("serviceId" in setting)) return;

      return await sendCommentsServiceJP(link, setting.serviceId, comments)
        .then(async (response) => {
          console.log(response);
          if (response?.error)
            return res
              .status(400)
              .json({ message: "Comments not sent", error: response.error });

          return await updateSiteOrderIdForExtraService(
            Number(id),
            setting.siteId,
            setting.serviceId,
            response.order,
          ).then(() => res.status(200).json({ message: "Comments sent" }));
        })
        .catch((err) => {
          logger.error(err.stack);
          return res.status(400).json({ message: "Comments not sent" });
        });
    } catch (err) {
      logger.error((err as Error).stack);
    }
  },
);
