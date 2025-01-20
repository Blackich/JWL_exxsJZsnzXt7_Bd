import { db } from "@src/main";
import { logErr } from "@src/middleware/errorHandler";

export const saveRejectedService = async (
  externalSetting: Record<string, string | number>,
) => {
  const externalSettingJSON = JSON.stringify(externalSetting);
  return await db
    .promise()
    .query(
      `INSERT INTO Reject_external (externalSetting)
        VALUES ('${externalSettingJSON}')`,
    )
    .then(([result]) => result)
    .catch((err) => logErr(err, "saveRejectedService"));
};
