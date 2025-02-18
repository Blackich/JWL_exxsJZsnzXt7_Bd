import cors from "cors";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import { r as router } from "@src/routes";
import { testRouter } from "./testRouter";
import { logger } from "./utils/logger/logger";
import { startCronJobs } from "./utils/cron/z";
import { errorHandler } from "@src/middleware/errorHandler";
import express, { Application, Request, Response } from "express";

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

startCronJobs();

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection at:", { reason });
});

db.addListener("error", () => console.log("error"));

app.listen(4444, () => {
  try {
    console.log("Server started on port 4444");
  } catch (err) {
    console.error(err);
  }
});
