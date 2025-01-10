import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { getUserCredentials } from "./Entity/queries";
import { tryCatch } from "@src/middleware/errorHandler";
import { NextFunction, Request, Response } from "express";
import { getTokens, getUnixTime, refreshTokenExpiresIn } from "./Entity/utils";

export const checkAuthUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = { isExipredAccess: false };
    const accessToken = (req.headers.authorization || "").replace(
      /Bearer\s?/,
      "",
    );

    if (!accessToken)
      return res.status(401).json({ message: "access-Token is required" });
    try {
      jwt.verify(
        accessToken,
        process.env.JWT_USER_ACCESS_KEY as string,
        (err) => {
          if (err?.name === "TokenExpiredError") {
            const refreshToken = req.cookies["refresh-Token"];
            if (!refreshToken)
              return res
                .status(401)
                .json({ message: "refresh-Token is required" });

            if (verifyRefreshToken(refreshToken) === null) {
              return res.status(401).json({ message: "Invalid refresh-Token" });
            }

            req.body = { isExipredAccess: true };
          }

          if (err && err?.name !== "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid token" });
          }

          next();
        },
      );
    } catch (err) {
      return null;
    }
  },
);

export const takeUserCredentials = tryCatch(
  async (req: Request, res: Response) => {
    const { isExipredAccess } = req.body;

    const accessToken = (req.headers.authorization as string).replace(
      /Bearer\s?/,
      "",
    );
    const accessTokenParts = accessToken.split(".");
    const decodedPayload = JSON.parse(atob(accessTokenParts[1]));

    if (isExipredAccess) {
      const userCred = await getUserCredentials(decodedPayload.email);
      if (userCred === null)
        return res.status(400).json({ codeErr: 99, message: "User not found" });

      const { accessToken } = getTokens(userCred.id, userCred.email);
      return res.status(200).json({
        id: userCred.id,
        email: userCred.email,
        accessToken: accessToken,
      });
    }

    //--------------------------------------------------

    const refreshToken = req.cookies["refresh-Token"];
    if (!refreshToken)
      return res.status(401).json({ message: "refresh-Token is required" });
    if (verifyRefreshToken(refreshToken) === null) {
      return res.status(401).json({ message: "Invalid refresh-Token" });
    }
    const decodedPayloadRefresh = JSON.parse(atob(accessTokenParts[1]));
    const { exp, iat } = decodedPayloadRefresh;
    if (exp && iat) {
      const halfExpTime = exp - (exp - iat) / 2;
      if (getUnixTime() > halfExpTime) {
        res.setHeader(
          "Set-Cookie",
          serialize("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenExpiresIn,
          }),
        );
      }
    }

    //--------------------------------------------------

    return res.status(200).json({
      id: decodedPayload.id,
      email: decodedPayload.email,
    });
  },
);

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    return jwt.verify(
      refreshToken,
      process.env.JWT_USER_REFRESH_KEY as string,
      (err) => {
        if (err) return null;
      },
    );
  } catch (err) {
    return null;
  }
};
