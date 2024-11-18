import { db } from "@src/main";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { getTokens, refreshTokenExpiresIn } from "@src/utils/utils";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { RowDataPacket } from "mysql2";

export const authEmployees = tryCatch(async (req: Request, res: Response) => {
  const { login, password } = req.body;
  db.query(
    `SELECT * FROM Employees WHERE login = '${login}'`,
    async (err, result: RowDataPacket[]) => {
      if (err) return dbError(err, res);
      //Login check
      if (!result[0])
        return res.status(404).json({
          message: "Incorrect login/password",
        });
      //Password check
      const isValidPass = await bcrypt.compare(password, result[0].password);
      if (!isValidPass)
        return res.status(404).json({
          message: "Incorrect login/password",
        });

      const { accessToken, refreshToken } = getTokens(login, result[0].role);

      res.setHeader(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: refreshTokenExpiresIn,
        }),
      );

      return res.status(200).json({
        login,
        token: accessToken,
      });
    },
  );
});

export const logoutEmployees = tryCatch(async (req: Request, res: Response) => {
  res.setHeader(
    "Set-Cookie",
    serialize("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
    }),
  );

  return res.status(200).json({ message: "Logout successful" });
});

export const authEmployeesCheck = tryCatch(
  async (req: Request, res: Response) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    const tokenParts = token.split(".");
    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    return res.status(200).json({
      message: "Authorized",
      data: {
        login: decodedPayload.login,
        token: token,
      },
    });
  },
);

export const authEmployeesRefresh = tryCatch(
  async (req: Request, res: Response) => {
    const refreshTokenOld = req.cookies.refreshToken;
    const tokenParts = refreshTokenOld.split(".");
    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    const { accessToken, refreshToken } = getTokens(
      decodedPayload.login,
      decodedPayload.role,
    );

    res.setHeader(
      "Set-Cookie",
      serialize("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiresIn,
      }),
    );
    res.status(200).json({
      login: decodedPayload.login,
      token: accessToken,
    });
  },
);
