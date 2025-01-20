import cron from "node-cron";
import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { isArray } from "@src/utils/utils";
import { logger } from "@src/utils/logger/logger";
import { PurchasePackage } from "@src/utils/types";
import { logErr } from "@src/middleware/errorHandler";
import { cancelServiceVR } from "@src/controllers/Services/Venro";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";
import { getAllPackageSubsByServiceId } from "@controllers/Purchase/Entity/CheckStatusSubs";

export const expServices = cron.schedule("*/5 * * * *", async () => {
  try {
    const expServs = await expiredServicesCheck();
    if (!isArray(expServs)) return;

    return expServs.map(async (expServ) => {
      await serviceStatusChange(expServ.id);
      await cancelAllSubs(expServ.id);
      console.log(`${expServ.id} service has been expired`);
    });
  } catch (err) {
    logger.error("expServices", { err });
  }
});

//--------------------------------------------------

const expiredServicesCheck = async () => {
  return await db
    .promise()
    .query(
      `SELECT id FROM Service
        WHERE status = 1
        AND DATE_ADD(createdAt, INTERVAL 30 DAY) < NOW()`,
    )
    .then(([result]) => {
      return result as { id: number }[];
    })
    .catch((err) => logErr(err, "expiredServicesCheck"));
};

const serviceStatusChange = async (expServId: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Service
        SET status = 0
        WHERE id = ${expServId}`,
    )
    .then(([result]) => {
      return result as RowDataPacket[];
    })
    .catch((err) => logErr(err, "serviceStatusChange"));
};

const cancelAllSubs = async (serviceId: number) => {
  const allSubsByServiceId = await getAllPackageSubsByServiceId(
    Number(serviceId),
  );
  if (!isArray(allSubsByServiceId)) return;

  return await Promise.allSettled(
    allSubsByServiceId.map(async (subscription: PurchasePackage) => {
      if (subscription.siteId === 1) {
        return cancelServiceVR(subscription.orderId).catch((err) => {
          logErr(err, "ExpServices/cancelServiceVR");
        });
      }
      if (subscription.siteId === 2) {
        return cancelServiceJP(subscription.orderId).catch((err) => {
          logErr(err, "ExpServices/cancelServiceJP");
        });
      }
    }),
  );
};
