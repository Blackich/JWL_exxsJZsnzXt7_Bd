import cors from "cors";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import { r as router } from "@src/routes";
import { testRouter } from "./testRouter";
import { startCronJobs } from "./utils/cron/z";
import express, { Application, Request, Response } from "express";
import { errorHandler, logErr } from "@src/middleware/errorHandler";

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

process.on("SIGINT", () => {
  console.log("Closing database connection...");
  db.end((err) => {
    if (err) console.error("Error closing database connection:", err);
    process.exit(0);
  });
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("DB Connected");
    connection.release();
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

process.on("unhandledRejection", (err) => {
  logErr(err as Error, "unhandled Rejection");
});

process.on("uncaughtException", (err) => {
  logErr(err as Error, "Uncaught Exception");
  process.exit(1);
});

app.listen(4444, () => console.log("Server started on port 4444"));
