import { db } from "@src/main";
import { Request, Response } from "express";
import { isNumber } from "@src/utils/utils";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
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
    if (!isNumber(serviceId))
      return res.status(400).json({ message: "Service not found" });

    const orderId = await getLikesOrderIdByServiceId(serviceId);
    if (!isNumber(orderId))
      return res.status(200).json({ message: "Order not found" });

    const serviceResp = await checkServiceVR(orderId).catch(() =>
      res.status(200).json({ message: "Service not connected" }),
    );
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

export const checkPackPurchaseOption = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT status
        FROM General_setting
        WHERE id = 1`,
      (err, result) => {
        if (err) return dbError(err, res);
        const status = (result as { status: number }[])[0].status;
        if (status === 1)
          return res.status(200).json({ message: "Package Ok", status: true });
        return res.status(200).json({
          message: "The option to purchase service Packages is unavailable",
          status: false,
        });
      },
    );
  },
);

export const checkExtraPurchaseOption = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT status
        FROM General_setting
        WHERE id = 2`,
      (err, result) => {
        if (err) return dbError(err, res);
        const status = (result as { status: number }[])[0].status;
        if (status === 1)
          return res.status(200).json({ message: "Extra Ok", status: true });
        return res.status(200).json({
          message: "The option to purchase Extra service is unavailable",
          status: false,
        });
      },
    );
  },
);

//--------------------------------------------------

const getLikesOrderIdByServiceId = async (serviceId: number) => {
  return await db
    .promise()
    .query(
      `SELECT pp.orderId 
        FROM Purchase_package pp, Package_setting ps
        WHERE pp.siteServiceId = ps.serviceId
        AND pp.serviceId = ${serviceId}
        AND ps.typeService = 'likes'`,
    )
    .then(([result]) => (result as { orderId: number }[])[0]?.orderId);
};

const serviceStatusChange = async (serviceId: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Service
        SET status = 0
        WHERE id = ${serviceId}`,
    )
    .then(([result]) => result);
};
