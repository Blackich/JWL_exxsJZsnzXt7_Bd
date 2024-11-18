import { db } from "@src/main";
import { NextFunction, Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";
import { serialize } from "cookie";

export const authUser = tryCatch(async (req: Request, res: Response) => {
  const { token } = req.body;
  console.log(token);
  db.query(
    `SELECT * FROM Users WHERE token = '${token}'`,
    async (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      if (!result[0]) return res.status(404).json("Incorrect token");

      res.setHeader(
        "Set-Cookie",
        serialize("session-Token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365,
        }),
      );
      return res.status(200).json({
        message: "Success authorization",
        id: result[0].id,
      });
    },
  );
});

export const logoutUser = tryCatch(async (req: Request, res: Response) => {
  res.setHeader(
    "Set-Cookie",
    serialize("session-Token", "", {
      httpOnly: true,
      maxAge: 0,
    }),
  );
  return res.status(200).json("Logout successful");
});

export const checkAuthUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies["session-Token"];

    if (!sessionToken) return res.status(401).json("Session token is required");

    db.query(
      `SELECT * FROM Users WHERE token = '${sessionToken}'`,
      async (err, result: RowDataPacket[]) => {
        if (err) return dbError(err, res);
        if (!result[0]) return res.status(404).json("Incorrect token");

        next();
      },
    );
  },
);

export const takeCredentialUser = tryCatch(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies["session-Token"];
    db.query(
      `SELECT * FROM Users WHERE token = '${sessionToken}'`,
      async (err, result: RowDataPacket[]) => {
        if (err) return dbError(err, res);
        if (!result[0]) return res.status(404).json("Incorrect token");

        return res.status(200).json({
          id: result[0].id,
        });
      },
    );
  },
);
