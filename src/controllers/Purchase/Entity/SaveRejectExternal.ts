import { db } from "@src/main";
import { logger } from "@src/utils/logger/logger";

export const saveRejectedService = async (
  externalSetting: Record<string, string | number>,
) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Reject_external (externalSetting)
        VALUES ('${JSON.stringify(externalSetting)}')`,
    )
    .catch((err) => logger.error(err.stack));
};
