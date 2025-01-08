import { db } from "@src/main";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { purchaseTestService } from "@src/controllers/Purchase/PurchaseTestService";

export const sendTestServices = tryCatch(
  async (req: Request, res: Response) => {
    const { testServiceId, employeeId, link, speed, comments } = req.body;
    if (!employeeId || !link || !testServiceId || !speed) return;

    return await purchaseTestService(testServiceId, speed, link, comments)
      .then(async (response) => {
        console.log(response, "resp Test Serv");

        const isErrorSentComments =
          (response as PromiseFulfilledResult<object | null>[])?.[0].value ===
          null;

        if (isErrorSentComments)
          return res.status(400).json({ message: "Comments not sent" });

        return await addInfoAboutTest(testServiceId, employeeId, link).then(
          () => {
            return res.status(200).json({ message: "Test sent" });
          },
        );
      })
      .catch((err) => {
        logger.error((err as Error).stack);
        return res.status(400).json({ message: "Test not sent" });
      });
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

//--------------------------------------------------

export const addInfoAboutTest = async (
  testServiceId: number,
  employeeId: number,
  link: string,
) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Test (testServiceId, employeeId, link)
        VALUES(${testServiceId}, ${employeeId}, '${link}')`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
};
