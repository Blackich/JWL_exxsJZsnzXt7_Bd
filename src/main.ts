import express, { Application, NextFunction, Request, Response } from "express";
import { errorHandler } from "@src/middleware/errorHandler";
import cookieParser from "cookie-parser";
import { r as router } from "@src/routes";
import mysql from "mysql2";
import cors from "cors";
import { purchasePackage } from "./controllers/Purchase/Purchase";
import { cancelAllSubs } from "./controllers/Purchase/Entity/CancelSubs";

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

// app.get("/test", cancelAllSubs());
// app.get("/test", checkStatusAllSubs());

app.get("/", async (req: Request, res: Response) => {
  const data = await purchasePackage(30, 120, 1, 5);
  // const data = await checkStatusAllSubs();
  console.log(data);
  res.status(200).json(data);
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(4444, () => {
  try {
    console.log("Server started on port 4444");
  } catch (err) {
    console.error(err);
  }
});
