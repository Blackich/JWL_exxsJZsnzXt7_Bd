import { db } from "@src/main";
import { isString } from "@src/utils/utils";
import { JustSetting } from "./Entity/types";
import { Request, Response } from "express";
import { updateJustHashNTime } from "./Entity/queries";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";

export const getJustSettings = tryCatch(async (req: Request, res: Response) => {
  db.query(`SELECT * FROM Just_setting`, (err, result) => {
    if (err) return dbError(err, res);
    const data = (result as JustSetting[])?.[0];
    return res.status(200).json(data);
  });
});

export const updateJustHash = tryCatch(async (req: Request, res: Response) => {
  const { hash } = req.body;
  if (!isString(hash))
    return res.status(400).json({ message: "Hash invalid" });

  await updateJustHashNTime(hash);

  const status = await cancelServiceJP(716102665);
  if (!status || status !== 200)
    return res
      .status(400)
      .json({ codeErr: 1, message: "Just error or Hash invalid" });

  return res.status(200).json({ message: "Just Hash has been updated" });
});
