import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { purchaseTestService } from "@src/controllers/Purchase/PurchaseTestService";

export const sendTestServices = tryCatch(
  async (req: Request, res: Response) => {
    const { testServiceId, employeeId, link, speed, comments } = req.body;
    if (!employeeId || !link || !testServiceId || !speed) return;
    const boughtPack = await purchaseTestService(
      testServiceId,
      speed,
      link,
      comments,
    );
    console.log(boughtPack);

    db.query(
      `INSERT INTO Test (id,
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
  },
);

export const getTestServicesSent = tryCatch(
  async (req: Request, res: Response) => {
    db.query(
      `SELECT t.id, ts.serviceName as testServiceName,
        e.fullName as senderName, t.link, t.createdAt
          FROM Test t, Test_service ts, Employees e
          WHERE t.testServiceId = ts.id 
          AND t.employeeId = e.id`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
