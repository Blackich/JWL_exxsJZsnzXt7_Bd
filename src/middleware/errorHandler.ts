import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger/logger";
import { QueryError } from "mysql2";

const dev = process.env.NODE_ENV === "dev" ? true : false;

type CustomError = Error & QueryError;
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error("ErrorHandler", { err });
  if (err.code && err.code.startsWith("ER_")) {
    res.status(450).json({ message: "Incorrect query", error: dev ? err : "" });
  } else {
    res.status(502).json({ message: "Smth went wrong", error: dev ? err : "" });
  }
};

export const dbError = (err: QueryError, res: Response) => {
  logger.error("Database error", { err });
  res.status(450).json({ message: "Incorrect query", error: dev ? err : "" });
};

export const tryCatch =
  (controller: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      return next(err);
    }
  };

export const isNum = (variable: unknown) => {
  return typeof variable === "number";
};

export const isStr = (variable: unknown) => {
  return typeof variable === "string";
};
