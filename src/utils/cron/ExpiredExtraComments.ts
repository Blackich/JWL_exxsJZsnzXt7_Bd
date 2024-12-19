import cron from "node-cron";
import { db } from "@src/main";
import { Logger } from "winston";
import { logger } from "@src/utils/logger/logger";

const isCommentsArray = (
  arg: { id: number }[] | Logger,
): arg is { id: number }[] => {
  return Array.isArray(arg) && arg.every((item) => "id" in item);
};

export const expExtraComments = cron.schedule("0 * * * *", async () => {
  try {
    const expComments = await expiredExtraCommentsCheck();
    if (Array.isArray(expComments) && expComments.length === 0) return;
    if (!isCommentsArray(expComments)) return;
    return expComments.map(async (expComm) => {
      await deleteCommentsByExtraServiceCommentId(expComm.id);
      console.log(`${expComm.id} comments has been expired`);
    });
  } catch (err) {
    logger.error((err as Error).stack);
  }
});

//--------------------------------------------------

export const expiredExtraCommentsCheck = async () => {
  const data = await db
    .promise()
    .query(
      `SELECT id FROM Extra_service_comment
        WHERE DATE_ADD(createdAt, INTERVAL 2 HOUR) < NOW()`,
    )
    .then(([result]) => {
      return result as { id: number }[] | [];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const deleteCommentsByExtraServiceCommentId = async (expCommId: number) => {
  const data = await db
    .promise()
    .query(
      `DELETE FROM Extra_service_comment
        WHERE id = ${expCommId}`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
