import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger/logger";
import { QueryError } from "mysql2";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.stack);
  return res.status(500).json({ message: "Server error", error: err.message });
};

export const dbError = (err: QueryError, res: Response) => {
  logger.error(err.stack);
  return res.status(404).json({ message: "Incorrect query", error: err });
};

export const tryCatch =
  (controller: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
