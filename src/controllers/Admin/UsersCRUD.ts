import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { OkPacketParams, RowDataPacket } from "mysql2";
import { fastRandString } from "@src/utils/utils";

export const getUserById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    `SELECT u.*, e.fullName FROM Users u, Employees e
      WHERE u.invitedEmployeeId = e.id AND u.id = ${id}`,
    (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      const data = result[0];
      return res.status(200).json(data);
    },
  );
});

export const getUsers = tryCatch(async (req: Request, res: Response) => {
  db.query(
    `SELECT u.*, e.fullName FROM Users u, Employees e
      WHERE u.invitedEmployeeId = e.id`,
    (err, result) => {
      if (err) return dbError(err, res);
      const data = result;
      return res.status(200).json(data);
    },
  );
});

export const createUser = tryCatch(async (req: Request, res: Response) => {
  const { employeeId } = req.body;
  const token = fastRandString(16);

  db.query(
    `INSERT INTO Users (id, token, invitedEmployeeId) 
      VALUES (null, '${token}', ${Number(employeeId)})`,
    async (err, _) => {
      if (err) return dbError(err, res);
      return res.status(200).json({ message: "User has been created" });
    },
  );
});

export const updateUserStatus = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    db.query(
      `SELECT status FROM Users 
      WHERE id = ${id}`,
      (err, result: RowDataPacket[]) => {
        if (err) return dbError(err, res);
        const status = result[0].status;

        db.query(
          `UPDATE Users 
            SET status = '${status === "active" ? "inactive" : "active"}' 
            WHERE id = ${id}`,
          (err, _) => {
            if (err) return dbError(err, res);
            return res.status(200).json({
              message: "User status has been updated",
            });
          },
        );
      },
    );
  },
);

export const updateUserRemark = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { remark } = req.body;

    db.query(
      `UPDATE Users SET remark = '${remark}' 
        WHERE id = ${id}`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({
          message: "User remark has been updated",
        });
      },
    );
  },
);

export const getUserSocialAccounts = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    db.query(
      `SELECT * FROM Social_nickname
        WHERE userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);

export const getCustomPackageByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT cp.likes, cp.reach, cp.saves, cp.profileVisits,
        cp.reposts, cp.videoViews, cp.countPosts,
        cp.price_rub, cp.price_usd
          FROM Custom_package_user cpu, Custom_package cp
          WHERE cpu.customPackageId = cp.id
          AND cpu.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);

export const deleteCustomPackageByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `DELETE FROM Custom_package_user 
        WHERE userId = ${id}`,
      (err, _) => {
        if (err) return dbError(err, res);
        return res.status(200).json({
          message: "Custom package has been deleted",
        });
      },
    );
  },
);

export const getServicesByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT s.id, sn.nickname,
        s.status, s.createdAt
          FROM Service s, Social_nickname sn
          WHERE s.socialNicknameId = sn.id
          AND s.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
