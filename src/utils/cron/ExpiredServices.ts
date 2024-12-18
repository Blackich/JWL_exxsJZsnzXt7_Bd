import cron from "node-cron";
import { db } from "@src/main";
import { Logger } from "winston";
import { RowDataPacket } from "mysql2";
import { logger } from "@src/utils/logger/logger";
import { PurchasePackage } from "@src/utils/types";
import { cancelServiceVR } from "@src/controllers/Services/Venro";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";
import { getAllPackageSubsByServiceId } from "@controllers/Purchase/Entity/CheckStatusSubs";

const isServiceArray = (
  arg: { id: number }[] | Logger,
): arg is { id: number }[] => {
  return Array.isArray(arg) && arg.every((item) => "id" in item);
};

export const expServices = cron.schedule("*/5 * * * *", async () => {
  try {
    const expServs = await expiredServicesCheck();
    if (Array.isArray(expServs) && expServs.length === 0) return;
    if (!isServiceArray(expServs)) return;
    return expServs.map(async (expServ) => {
      await serviceStatusChange(expServ.id);
      await cancelAllSubs(expServ.id);
      console.log(`${expServ.id} service has been expired`);
    });
  } catch (err) {
    logger.error((err as Error).stack);
  }
});

//--------------------------------------------------

const expiredServicesCheck = async () => {
  const data = await db
    .promise()
    .query(
      `SELECT id FROM Service
        WHERE status = 1
        AND DATE_ADD(createdAt, INTERVAL 30 DAY) < NOW()`,
    )
    .then(([result]) => {
      return result as { id: number }[] | [];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const serviceStatusChange = async (expServId: number) => {
  const data = await db
    .promise()
    .query(
      `UPDATE Service
        SET status = 0
        WHERE id = ${expServId}`,
    )
    .then(([result]) => {
      return result as RowDataPacket[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const cancelAllSubs = async (serviceId: number) => {
  const allSubsByServiceId = await getAllPackageSubsByServiceId(
    Number(serviceId),
  );
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
  );
};
