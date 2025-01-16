import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { fastRandString } from "@src/utils/utils";
import { dbError, tryCatch } from "@src/middleware/errorHandler";

export const getUserById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    `SELECT id, email, status, createdAt FROM Users
      WHERE id = ${id}`,
    (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      const data = result[0];
      return res.status(200).json(data);
    },
  );
});

export const getUsers = tryCatch(async (req: Request, res: Response) => {
  db.query(`SELECT id, email, createdAt FROM Users`, (err, result) => {
    if (err) return dbError(err, res);
    const data = result;
    return res.status(200).json(data);
  });
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

// export const updateUserRemark = tryCatch(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { remark } = req.body;

//     db.query(
//       `UPDATE Users SET remark = '${remark}' 
//         WHERE id = ${id}`,
//       (err, _) => {
//         if (err) return dbError(err, res);
//         return res.status(200).json({
//           message: "User remark has been updated",
//         });
//       },
//     );
//   },
// );

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
      `SELECT cpd.likes, cpd.reach, cpd.saves, cpd.profileVisits,
        cpd.reposts, cpd.videoViews, cpd.countPosts,
        cpd.price_rub, cpd.price_usd
          FROM Custom_package_user cpu, Custom_package_detail cpd
          WHERE cpu.customPackageId = cpd.id
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

export const getExtraByUserId = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    db.query(
      `SELECT ex.id, sn.nickname, ex.count, ex.createdAt,
        exs.serviceName as extraServiceName
        FROM Extra ex
        LEFT JOIN Users u ON u.id = ex.userId
        LEFT JOIN Extra_service exs ON exs.id = ex.extraServiceId
        LEFT JOIN Social_nickname sn ON sn.id = ex.socialNicknameId
          WHERE ex.userId = ${id}`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
