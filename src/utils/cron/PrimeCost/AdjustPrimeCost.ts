import cron from "node-cron";
import { logger } from "@src/utils/logger/logger";
import { primeCostChangeControl } from "./PrimeCostChangeControl";

export const adjustPrimeCost = cron.schedule("0 * * * *", async () => {
  try {
    await primeCostChangeControl();
  } catch (err) {
    logger.error("adjustPrimeCost", { err });
  }
});
