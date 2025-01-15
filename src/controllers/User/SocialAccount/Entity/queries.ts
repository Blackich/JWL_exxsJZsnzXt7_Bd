import { db } from "@src/main";

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

export const addInstAccountToUser = async (id: number, username: string) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Social_nickname (userId, messangerId, nickname)
        VALUES (${id}, 1, '${username}')`,
    )
    .then(([result]) => result);
};
