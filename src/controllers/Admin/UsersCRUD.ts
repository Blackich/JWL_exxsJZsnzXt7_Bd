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
  const token = fastRandString(16);

  db.query(
    `INSERT INTO Users (id, token) 
      VALUES (null, '${token}')`,
    async (err, result) => {
      if (err) dbError(err, res);
      const newId = (result as OkPacketParams).insertId;

      db.query(
        `SELECT * FROM Users WHERE id = ${newId}`,
        async (err, result: RowDataPacket[]) => {
          if (err) return dbError(err, res);
          return res.status(201).json({
            message: "User has been created",
            data: result[0],
          });
        },
      );
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

// export const getUserPurchasedServices = (req, res) => {
//   const { id } = req.params;
//   try {
//     db.query(`SELECT s.id, sn.nickname, p.likes, s.customPackage,
//               s.countPosts, s.status, s.createdAt, s.cost, s.currency
//               FROM Service s, Social_nickname sn, Package p
//               WHERE s.socialNicknameId = sn.id
//                 AND s.packageId = p.id
//                 AND s.userId = ${id}`, (err, result) => {
//       if (err) return res.status(404).json({ message: 'Incorrect query', error: err });
//       const data = result;
//       return res.status(200).json(data);
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: 'Server error',
//       error: err.message
//     });
//   }
// };
