import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { tryCatch } from "@src/middleware/errorHandler";
import { getUserCredentialsById } from "./Entity/queries";
import { NextFunction, Request, Response } from "express";
import { getTokens, getUnixTime, refreshTokenExpiresIn } from "./Entity/utils";

type CustomRequest = Request & { auth: { isExipredAccess: boolean } };

export const checkAuthUser = tryCatch(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    req.auth = { isExipredAccess: false };
    const accessToken = (req.headers.authorization || "").replace(
      /Bearer\s?/,
      "",
    );

    if (!accessToken)
      return res.status(401).json({ message: "(1) access-Token is required" });

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
                .json({ message: "(1) refresh-Token is required" });

            if (verifyRefreshToken(refreshToken) === null) {
              return res
                .status(401)
                .json({ message: "(1) Invalid refresh-Token" });
            }

            req.auth.isExipredAccess = true;
          }

          if (err && err?.name !== "TokenExpiredError") {
            return res
              .status(401)
              .json({ message: "(1) Invalid access-Token" });
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
  async (req: CustomRequest, res: Response) => {
    const { isExipredAccess } = req.auth;

    const refreshTokenCookie = req.cookies["refresh-Token"];
    if (!refreshTokenCookie)
      return res.status(401).json({ message: "(2) refresh-Token is required" });

    if (verifyRefreshToken(refreshTokenCookie) === null) {
      return res.status(401).json({ message: "(2) Invalid refresh-Token" });
    }

    const refreshTokenParts = refreshTokenCookie.split(".");
    const decodedPayloadRefresh = JSON.parse(atob(refreshTokenParts[1]));
    const { exp, iat } = decodedPayloadRefresh;
    if (exp && iat) {
      const halfExpTime = exp - (exp - iat) / 2;
      if (getUnixTime() > halfExpTime) {
        const userCred = await getUserCredentialsById(decodedPayloadRefresh.id);
        if (userCred === null)
          return res
            .status(400)
            .json({ codeErr: 99, message: "(2) User not found" });

        const { refreshToken } = getTokens(userCred.id, userCred.email);
        res.setHeader(
          "Set-Cookie",
          serialize("refresh-Token", refreshToken, {
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
      const userCred = await getUserCredentialsById(decodedPayload.id);
      if (userCred === null)
        return res
          .status(400)
          .json({ codeErr: 99, message: "(2) User not found" });

      const { accessToken } = getTokens(userCred.id, userCred.email);

      return res.status(200).json({
        id: userCred.id,
        email: userCred.email,
        accessToken: accessToken,
      });
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
