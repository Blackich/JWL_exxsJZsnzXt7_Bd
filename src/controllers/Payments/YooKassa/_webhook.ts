import { db } from "@src/main";
import { Request, Response } from "express";
import { dbError, tryCatch } from "@src/middleware/errorHandler";
import { sendTelegramMessage } from "@controllers/Payments/Telegram";

export const paymenStatusCatch = tryCatch(
  async (req: Request, res: Response) => {
    const responseYooKassaPay = req.body;
    if (responseYooKassaPay.event !== "payment.succeeded") return;
    const meta = responseYooKassaPay.object.metadata;
    const isCustPack = Number(meta.custom_package) === 0 ? false : true;
    const orderId = responseYooKassaPay.object.id;
    const amount = responseYooKassaPay.object.amount;
    sendTelegramMessage(
      meta.user_id,
      meta.soc_nickname_id,
      meta.package_id,
      meta.custom_package,
      meta.count_posts,
      amount.value,
      "RUB",
      "YooKassa",
    );

    db.query(
      `INSERT INTO Service (id, userId, socialNicknameId, 
        packageId, customPackageId, customPackage, countPosts,
        orderId, cost, currency) 
          VALUES (null, ${meta.user_id}, ${meta.soc_nickname_id}, 
        ${isCustPack ? null : meta.package_id}, 
        ${isCustPack ? meta.package_id : null},
        ${meta.custom_package}, ${meta.count_posts}, '${orderId}',
        ${amount.value}, '${amount.currency}')`,
      (err, result) => {
        if (err) return dbError(err, res);
        const data = result;
        return res.status(200).json(data);
      },
    );
  },
);
