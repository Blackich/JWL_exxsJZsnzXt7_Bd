import { db } from "@src/main";
import { ResultSetHeader } from "mysql2";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { tryCatch } from "@src/middleware/errorHandler";
import { AddServiceExtra, AddServicePack, Metadata } from "./type";
import { purchaseExtra } from "@src/controllers/Purchase/PurchaseExtra";
import { purchasePackage } from "@src/controllers/Purchase/PurchasePack";
import {
  sendTelegramMessageExtra,
  sendTelegramMessagePack,
} from "@src/controllers/Payments/YooKassa/Telegram";
import { purchaseCustomPackage } from "@src/controllers/Purchase/PurchaseCustomPack";
import { sendTGMessageComment } from "@src/controllers/Purchase/Telegram";

export const paymenStatusCatch = tryCatch(
  async (req: Request, res: Response) => {
    const responseYooKassaPay = req.body;
    if (responseYooKassaPay.event !== "payment.succeeded") return;
    const orderId = responseYooKassaPay.object.id;
    const amount = responseYooKassaPay.object.amount;
    const meta: Metadata = responseYooKassaPay.object.metadata;

    if (meta.serviceName === "package") {
      const isCustPack = Number(meta.customPackage) === 0 ? false : true;
      await addInfoAboutBoughtPack({
        meta,
        amount,
        orderId,
        isCustPack,
        paymentServiceName: "YooKassa",
      });
      await sendTelegramMessagePack({
        userId: meta.userId,
        socialNicknameId: meta.socialNicknameId,
        packageId: meta.packageId,
        customPackage: meta.customPackage,
        countPosts: meta.countPosts,
        cost: amount.value,
        currency: "RUB",
        paymentServiceName: "YooKassa",
      });
    }

    if (meta.serviceName === "extra") {
      await addInfoAboutBoughtExtra({
        meta,
        orderId,
        paymentServiceName: "YooKassa",
      });
    }

    return res.status(200).json(meta);
  },
);

//--------------------------------------------------

export const addInfoAboutBoughtPack = async ({
  meta,
  amount,
  orderId,
  isCustPack,
  paymentServiceName,
}: AddServicePack) => {
  await db
    .promise()
    .query(
      `INSERT INTO Service (id, userId, socialNicknameId, 
        packageId, customPackageId, customPackage, countPosts,
        orderId, cost, currency, paymentServiceName) 
          VALUES (null, ${meta.userId}, ${meta.socialNicknameId}, 
        ${isCustPack ? null : meta.packageId}, 
        ${isCustPack ? meta.packageId : null},
        ${meta.customPackage}, ${meta.countPosts}, '${orderId}',
        ${amount.value}, '${amount.currency}', '${paymentServiceName}')`,
    )
    .then(async ([result]) => {
      const insertId = (result as ResultSetHeader).insertId;
      if (!isCustPack) {
        await purchasePackage(
          insertId,
          meta.socialNicknameId,
          meta.packageId,
          meta.countPosts,
        );
      } else {
        await purchaseCustomPackage(
          insertId,
          meta.socialNicknameId,
          meta.packageId,
          meta.countPosts,
        );
      }
    })
    .catch((err) => logger.error(err.stack));
};

export const addInfoAboutBoughtExtra = async ({
  meta,
  orderId,
  paymentServiceName,
}: AddServiceExtra) => {
  await db
    .promise()
    .query(
      `INSERT INTO Extra (id, userId, socialNicknameId, 
        extraServiceId, count, priceRUB, priceUSD,
        paymentOrderId, paymentServiceName) 
          VALUES (null, ${meta.userId}, ${meta.socialNicknameId}, 
          ${meta.serviceId}, ${meta.count}, ${meta.priceRUB}, 
          ${meta.priceUSD}, '${orderId}', '${paymentServiceName}')`,
    )
    .then(async ([result]) => {
      const insertId = (result as ResultSetHeader).insertId;
      //Comments
      if (meta.serviceId === 3 || meta.serviceId === 4) {
        await sendTGMessageComment({
          extraId: insertId,
          userId: meta.userId,
          countComments: meta.count,
          extraServiceId: meta.serviceId,
          socialNicknameId: meta.socialNicknameId,
        });
        await sendTelegramMessageExtra({
          extraId: insertId,
          userId: meta.userId,
          socialNicknameId: meta.socialNicknameId,
          extraServiceId: meta.serviceId,
          count: meta.count,
          cost: meta.priceRUB,
          paymentServiceName,
        });
        return;
      } else {
        //Other
        await purchaseExtra(
          insertId,
          meta.socialNicknameId,
          meta.serviceId,
          meta.count,
        );
        await sendTelegramMessageExtra({
          extraId: insertId,
          userId: meta.userId,
          socialNicknameId: meta.socialNicknameId,
          extraServiceId: meta.serviceId,
          count: meta.count,
          cost: meta.priceRUB,
          paymentServiceName,
        });
      }
    })
    .catch((err) => logger.error(err.stack));
};
