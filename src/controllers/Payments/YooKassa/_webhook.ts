import { db } from "@src/main";
import { ResultSetHeader } from "mysql2";
import { Request, Response } from "express";
import { logger } from "@src/utils/logger/logger";
import { tryCatch } from "@src/middleware/errorHandler";
import { AddServiceExtra, AddServicePack, Metadata } from "./type";
import { purchasePackage } from "@src/controllers/Purchase/PurchasePack";
import { sendTelegramMessagePack } from "@src/controllers/Payments/YooKassa/Telegram";
import { purchaseCustomPackage } from "@src/controllers/Purchase/PurchaseCustomPack";

export const paymenStatusCatch = tryCatch(
  async (req: Request, res: Response) => {
    const responseYooKassaPay = req.body;
    if (responseYooKassaPay.event !== "payment.succeeded") return;
    const orderId = responseYooKassaPay.object.id;
    const amount = responseYooKassaPay.object.amount;
    const meta: Metadata = responseYooKassaPay.object.metadata;

    if (meta.serviceName === "package") {
      const isCustPack = Number(meta.customPackage) === 0 ? false : true;
      await addInfoAboutBoughtPack({ meta, isCustPack, amount, orderId });
      await sendTelegramMessagePack({
        userId: meta.userId,
        socialNicknameId: meta.socialNicknameId,
        packageId: meta.packageId,
        customPackage: meta.customPackage,
        countPosts: meta.countPosts,
        cost: amount.value,
        currency: "RUB",
        service: "YooKassa",
      });
    }

    if (meta.serviceName === "extra") {
      addInfoAboutBoughtExtra({ meta, amount, orderId });
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
}: AddServicePack) => {
  await db
    .promise()
    .query(
      `INSERT INTO Service (id, userId, socialNicknameId, 
        packageId, customPackageId, customPackage, countPosts,
        orderId, cost, currency) 
          VALUES (null, ${meta.userId}, ${meta.socialNicknameId}, 
        ${isCustPack ? null : meta.packageId}, 
        ${isCustPack ? meta.packageId : null},
        ${meta.customPackage}, ${meta.countPosts}, '${orderId}',
        ${amount.value}, '${amount.currency}')`,
    )
    .then(async ([result]) => {
      if (!isCustPack) {
        await purchasePackage(
          (result as ResultSetHeader).insertId,
          meta.socialNicknameId,
          meta.packageId,
          meta.countPosts,
        );
      } else {
        await purchaseCustomPackage(
          (result as ResultSetHeader).insertId,
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
  amount,
  orderId,
}: AddServiceExtra) => {
  await db
    .promise()
    .query(
      `INSERT INTO Service (id, userId, socialNicknameId, 
        packageId, customPackageId, customPackage, countPosts,
        orderId, cost, currency) 
          VALUES (null, ....)`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
};
