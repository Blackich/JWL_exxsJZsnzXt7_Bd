import express, { Application, NextFunction, Request, Response } from "express";
import { errorHandler } from "@src/middleware/errorHandler";
import cookieParser from "cookie-parser";
import { router } from "@src/routes";
import mysql from "mysql2";
import cors from "cors";

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

app.post("/", async (req: Request, res: Response) => {
  res.status(200).json({ data: "Hello World!" });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// app.use(router);

app.listen(4444, () => {
  try {
    console.log("Server started on port 4444");
  } catch (err) {
    console.error(err);
  }
});
