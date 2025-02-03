import { isString } from "@src/utils/utils";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { tryCatch } from "@src/middleware/errorHandler";
import { NextFunction, Request, Response } from "express";

export type ResetPasscRequest = Request & { userId: number };

export const checkTokenResetPass = tryCatch(
  async (req: ResetPasscRequest, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token || !isString(token))
      return res.status(400).json({ codeErr: 1, message: "Invalid token" });

    const jwtToken = Buffer.from(token, "base64url").toString("utf8");
    if (!jwtToken)
      return res.status(400).json({ codeErr: 1, message: "Invalid token" });

    try {
      jwt.verify(jwtToken, process.env.JWT_USER_PASS_RESET as string, (err) => {
        if (err) {
          throw err;
        }
      });
    } catch (err) {
      if ((err as VerifyErrors).name === "TokenExpiredError")
        return res
          .status(400)
          .json({ codeErr: 2, message: "Your reset link is expired" });

      return res.status(400).json({ codeErr: 1, message: "Invalid link" });
    }

    const decodeJwt = jwt.decode(jwtToken) as {
      id: number;
      exp: number;
    };
    if (!decodeJwt?.id)
      return res
        .status(400)
        .json({ codeErr: 99, message: "Something went wrong" });

    req.userId = decodeJwt.id;

    next();
  },
);
