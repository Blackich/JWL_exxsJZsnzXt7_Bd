import { db } from "@src/main";

export const getGenSettingStatusById = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT status
        FROM General_setting
        WHERE id = ${id}`,
    )
    .then(([result]) => (result as { status: number }[])[0]?.status);
};

export const getExtraServiceStatusById = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT status
        FROM Extra_service_detail
        WHERE extraServiceId = ${id}`,
    )
    .then(([result]) => (result as { status: number }[])[0]?.status);
};

export const updateJustHashNTime = async (hash: string) => {
  return await db
    .promise()
    .query(
      `UPDATE Just_setting
        SET hash = '${hash}', updatedAt = NOW()
        WHERE id = 1`,
    )
    .then(([result]) => result);
};
