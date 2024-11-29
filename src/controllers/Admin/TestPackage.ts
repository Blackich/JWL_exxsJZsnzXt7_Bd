import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { purchaseTestPackage } from "../Purchase/PurchaseTestPack";

export const sendTestPackage = tryCatch(async (req: Request, res: Response) => {
  const { testServiceId, employeeId, link } = req.body;
  // const boughtPack = await purchaseTestPackage(testServiceId, link);
  db.query(
    `INSERT INTO Test_package_list (id,
      testServiceId, employeeId, link) 
      VALUES(null, ${testServiceId},
        ${employeeId}, '${link}')`,
    (err, _) => {
      if (err) return dbError(err, res);
      return res.status(200).json({
        message: "Test package has been sent",
      });
    },
  );
});
