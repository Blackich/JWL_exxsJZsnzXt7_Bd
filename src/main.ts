import cors from "cors";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import { r as router } from "@src/routes";
import { testRouter } from "./testRouter";
import { expServices } from "./utils/cron/ExpiredServices";
import { errorHandler } from "@src/middleware/errorHandler";
import { updExchangeRate } from "./utils/cron/UpdateExchangeRate";
import { expExtraComments } from "./utils/cron/ExpiredExtraComments";
import { adjustPrimeCost } from "./utils/cron/PrimeCost/AdjustPrimeCost";
import express, { Application, NextFunction, Request, Response } from "express";

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_DB_PASSWORD,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB Connected");
  }
});

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(router);
app.use(testRouter);

expServices.start();
expExtraComments.start();
adjustPrimeCost.start();
updExchangeRate.start();

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

db.addListener("error", () => console.log("error"));

app.listen(4444, () => {
  try {
    console.log("Server started on port 4444");
  } catch (err) {
    console.error(err);
  }
});
