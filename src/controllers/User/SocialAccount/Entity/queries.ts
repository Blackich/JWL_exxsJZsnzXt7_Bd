import { db } from "@src/main";
import { InstSetting } from "./type";
import { logErr } from "@src/middleware/errorHandler";

export const getSocialAccListByUserId = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT id, nickname, instProfileId
        FROM Social_nickname 
        WHERE userId = ${id}
        AND messangerId = 1
        AND status = 1`,
    )
    .then(([result]) => result as { id: number; nickname: string }[]);
};

export const checkUniqueInstAcc = async (id: number, username: string) => {
  return await db
    .promise()
    .query(
      `SELECT id, status FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1
          AND nickname = '${username}'`,
    )
    .then(([result]) => (result as { id: number; status: number }[])?.[0]);
};

export const setActiveStatusInstAcc = async (id: number, username: string) => {
  return await db
    .promise()
    .query(
      `UPDATE Social_nickname
        SET status = 1
        WHERE userId = ${id}
          AND messangerId = 1 
          AND nickname = '${username}'`,
    )
    .then(([result]) => result);
};

export const checkCountInstAccByUserId = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT COUNT(*) as count
        FROM Social_nickname
        WHERE userId = ${id}
          AND messangerId = 1`,
    )
    .then(([result]) => {
      return (result as { count: number }[])[0].count;
    });
};

export const addInstAccountToUser = async (
  id: number,
  username: string,
  instProfileId?: string | null,
) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Social_nickname (userId, messangerId, nickname, instProfileId)
        VALUES (${id}, 1, '${username}'${
        instProfileId ? `, '${instProfileId}'` : ""
      })`,
    )
    .then(([result]) => result);
};

export const getInstSettings = async () => {
  return await db
    .promise()
    .query(
      `SELECT token, userId, sessionId
        FROM Inst_setting
        WHERE status = 1`,
    )
    .then(([result]) => (result as InstSetting[])[0])
    .catch((err) => logErr(err, "SearchSocialAccount/getInstSettings"));
};

export const updateInstProfileIdByUserId = async (
  instProfileId: string,
  socAccId: number,
) => {
  return await db
    .promise()
    .query(
      `UPDATE Social_nickname
        SET instProfileId = '${instProfileId}'
        WHERE id = ${socAccId}`,
    )
    .then(([result]) => result)
    .catch((err) => logErr(err, "updateInstProfileIdByUserId"));
};
