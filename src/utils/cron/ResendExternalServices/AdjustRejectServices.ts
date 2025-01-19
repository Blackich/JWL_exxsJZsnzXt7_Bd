import cron from "node-cron";
import { logger } from "@src/utils/logger/logger";
import { customizeRejectServices } from "./Settings";

export const resendExtServices = cron.schedule("*/10 * * * *", async () => {
  try {
    await customizeRejectServices();
  } catch (err) {
    logger.error("resendExtServices", { err });
  }
});
