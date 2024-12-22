import { db } from "@src/main";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { tryCatch } from "@src/middleware/errorHandler";
import { checkServiceVR, checkStatusSites } from "@controllers/Services/Venro";

export const checkStatusExternalServices = tryCatch(
  async (req: Request, res: Response) => {
    const statuses = await checkStatusSites();
    if (statuses.every((status) => status === 200)) {
      res.status(200).json({ message: "All services are active" });
    } else {
      res.status(400).json({ message: "Some services are unavailable" });
    }
  },
);

export const checkPostsRemaining = tryCatch(
  async (req: Request, res: Response) => {
    const { serviceId } = req.body;
    if (!serviceId || typeof serviceId !== "number")
      return res.status(400).json({ message: "Service not found" });

    const orderId = await getLikesOrderIdByServiceId(serviceId);
    if (typeof orderId !== "number")
      return res.status(200).json({ message: "Order not found" });

    const serviceResp = await checkServiceVR(orderId);
    if (!serviceResp || !("status" in serviceResp))
      return res.status(200).json({ message: "Service not connected" });

    if (
      serviceResp.remains &&
      typeof serviceResp.remains === "string" &&
      serviceResp.remains === "0"
    ) {
      await serviceStatusChange(serviceId);
      return res.status(200).json({ message: "Service canceled", count: 0 });
    }

    const remains = Number(serviceResp.remains);
    if (serviceResp.status !== "Active")
      return res
        .status(200)
        .json({ message: "Service not active", count: remains });

    return res.status(200).json({ count: remains });
  },
);

//--------------------------------------------------

const getLikesOrderIdByServiceId = async (serviceId: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT pp.orderId 
        FROM Purchase_package pp, Package_setting ps
        WHERE pp.siteServiceId = ps.serviceId
        AND pp.serviceId = ${serviceId}
        AND ps.typeService = 'likes'`,
    )
    .then(([result]) => {
      const dbResult = result as { orderId: number }[];
      if (!dbResult || dbResult.length === 0) return;
      return dbResult[0].orderId;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const serviceStatusChange = async (serviceId: number) => {
  const data = await db
    .promise()
    .query(
      `UPDATE Service
        SET status = 0
        WHERE id = ${serviceId}`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
