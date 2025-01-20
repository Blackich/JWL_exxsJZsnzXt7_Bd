import cron from "node-cron";
import { db } from "@src/main";
import { isArray } from "@src/utils/utils";
import { logger } from "@src/utils/logger/logger";
import { logErr } from "@src/middleware/errorHandler";

export const expExtraComments = cron.schedule("0 * * * *", async () => {
  try {
    const expComments = await expiredExtraCommentsCheck();
    if (!isArray(expComments)) return;

    return expComments.map(async (expComm) => {
      await deleteCommentsByExtraServiceCommentId(expComm.id);
      console.log(`${expComm.id} comments has been expired`);
    });
  } catch (err) {
    logger.error("expExtraComments", { err });
  }
});

//--------------------------------------------------

const expiredExtraCommentsCheck = async () => {
  return await db
    .promise()
    .query(
      `SELECT id FROM Extra_service_comment
        WHERE DATE_ADD(createdAt, INTERVAL 2 HOUR) < NOW()`,
    )
    .then(([result]) => {
      return result as { id: number }[];
    })
    .catch((err) => logErr(err, "expiredExtraCommentsCheck"));
};

const deleteCommentsByExtraServiceCommentId = async (expCommId: number) => {
  return await db
    .promise()
    .query(
      `DELETE FROM Extra_service_comment
        WHERE id = ${expCommId}`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logErr(err, "deleteCommentsByExtraServiceCommentId"));
};
