import { db } from "@src/main";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";

export const getRemarkByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const userRemark = await getRemark(Number(id));
    return res.status(200).json(userRemark);
  },
);

export const updateUserRemark = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { remark } = req.body;

    const isUserRemarkExist = await checkUserRemarkExist(Number(id));

    if (!isUserRemarkExist) {
      await insertRemark(Number(id), remark);
      return res.status(200).json({
        message: "User remark has been created",
      });
    } else {
      await updateRemark(Number(id), remark);
      return res.status(200).json({
        message: "User remark has been updated",
      });
    }
  },
);

//--------------------------------------------------

const checkUserRemarkExist = async (userId: number) => {
  return await db
    .promise()
    .query(
      `SELECT userId FROM User_remark
        WHERE userId = ${userId}`,
    )
    .then(([result]) => (result as { userId: number }[])[0]?.userId);
};

const getRemark = async (userId: number) => {
  return await db
    .promise()
    .query(
      `SELECT remark FROM User_remark
        WHERE userId = ${userId}`,
    )
    .then(([result]) => (result as { remark: string }[])[0]?.remark);
};

const insertRemark = async (userId: number, remark: string) => {
  return await db
    .promise()
    .query(
      `INSERT INTO User_remark (userId, remark)
        VALUES (${userId}, '${remark}')`,
    )
    .then(([result]) => result);
};

const updateRemark = async (userId: number, remark: string) => {
  return await db
    .promise()
    .query(
      `UPDATE User_remark 
        SET remark = '${remark}'
        WHERE userId = ${userId}`,
    )
    .then(([result]) => result);
};
