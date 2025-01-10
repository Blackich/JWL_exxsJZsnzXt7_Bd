import jwt, { VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";

export const checkAuth = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization as string).replace(
      /Bearer\s?/,
      "",
    );

    if (!token) return res.status(401).json({ message: "Token is required" });

    try {
      jwt.verify(token, process.env.JWT_ADMIN_ACCESS_KEY || "", (err) => {
        if (err)
          return res
            .status(404)
            .json({ message: "Invalid token", error: err.message });
        next();
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong (access token)",
        error: (err as Error).message,
      });
    }
  },
);

export const verifyRefreshToken = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token is required" });

    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_ADMIN_REFRESH_KEY as string,
        (err: VerifyErrors | null) => {
          if (err)
            return res.status(404).json({
              message: "Invalid token",
              error: err.message,
            });
          next();
        },
      );
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong (refreshToken)",
        error: (err as Error).message,
      });
    }
  },
);
