import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { tryCatch } from "@src/middleware/errorHandler";
import { NextFunction, Request, Response } from "express";
import { getEmployeeCredentialsByLogin } from "./Entity/queries";
import {
  getAdminTokens,
  getUnixTime,
  refreshTokenExpiresIn,
} from "./Entity/utils";

type CustomRequest = Request & { authAdmin: { isExipredAccess: boolean } };

export const checkAuth = tryCatch(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    req.authAdmin = { isExipredAccess: false };
    const accessToken = (req.headers.authorization || "").replace(
      /Bearer\s?/,
      "",
    );

    if (!accessToken)
      return res.status(401).json({ message: "(1) accessToken is required" });

    try {
      jwt.verify(
        accessToken,
        process.env.JWT_ADMIN_ACCESS_KEY as string,
        (err) => {
          if (err?.name === "TokenExpiredError") {
            const refreshToken = req.cookies["refToken"];
            if (!refreshToken)
              return res
                .status(401)
                .json({ message: "(1) refToken is required" });

            if (verifyRefreshToken(refreshToken) === null) {
              return res.status(401).json({ message: "(1) Invalid refToken" });
            }

            req.authAdmin.isExipredAccess = true;
          }

          if (err && err?.name !== "TokenExpiredError") {
            return res.status(401).json({ message: "(1) Invalid accessToken" });
          }

          next();
        },
      );
    } catch (err) {
      return null;
    }
  },
);

export const takeAdminCredentials = tryCatch(
  async (req: CustomRequest, res: Response) => {
    const { isExipredAccess } = req.authAdmin;

    const refreshTokenCookie = req.cookies["refToken"];
    if (!refreshTokenCookie)
      return res.status(401).json({ message: "(2) refToken is required" });

    if (verifyRefreshToken(refreshTokenCookie) === null) {
      return res.status(401).json({ message: "(2) Invalid refToken" });
    }

    const refreshTokenParts = refreshTokenCookie.split(".");
    const decodedPayloadRefresh = JSON.parse(atob(refreshTokenParts[1]));
    const { exp, iat } = decodedPayloadRefresh;
    if (exp && iat) {
      const halfExpTime = exp - (exp - iat) / 2;
      if (getUnixTime() > halfExpTime) {
        const adminCred = await getEmployeeCredentialsByLogin(
          decodedPayloadRefresh.login,
        );
        if (adminCred === null)
          return res.status(400).json({ message: "(2) Employee not found" });

        const { refreshToken } = getAdminTokens(
          adminCred.id,
          adminCred.login,
          adminCred.role,
        );

        res.setHeader(
          "Set-Cookie",
          serialize("refToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenExpiresIn,
          }),
        );
      }
    }

    //--------------------------------------------------

    const accessTokenLS = (req.headers.authorization as string).replace(
      /Bearer\s?/,
      "",
    );
    const accessTokenParts = accessTokenLS.split(".");
    const decodedPayload = JSON.parse(atob(accessTokenParts[1]));

    if (isExipredAccess) {
      const adminCred = await getEmployeeCredentialsByLogin(
        decodedPayload.login,
      );
      if (adminCred === null)
        return res
          .status(400)
          .json({ codeErr: 99, message: "(2) Employee not found" });

      const { accessToken } = getAdminTokens(
        adminCred.id,
        adminCred.login,
        adminCred.role,
      );

      return res.status(200).json({
        employeeId: adminCred.id,
        login: adminCred.login,
        role: adminCred.role,
        token: accessToken,
      });
    }

    //--------------------------------------------------

    return res.status(200).json({
      employeeId: decodedPayload.employeeId,
      login: decodedPayload.login,
      role: decodedPayload.role,
    });
  },
);

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    return jwt.verify(
      refreshToken,
      process.env.JWT_ADMIN_REFRESH_KEY as string,
      (err) => {
        if (err) return null;
      },
    );
  } catch (err) {
    return null;
  }
};
