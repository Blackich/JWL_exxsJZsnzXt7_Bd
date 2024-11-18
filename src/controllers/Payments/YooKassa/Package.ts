import axios from "axios";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import { logger } from "@src/utils/logger/logger";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const paymentRequestSchema = z.object({
  cost: z.number(),
  userId: z.number(),
  packageId: z.number(),
  countPosts: z.number(),
  socialNicknameId: z.number(),
  currency: z.union([z.literal("RUB"), z.literal("USD")]),
  type: z.union([z.literal("bank_card"), z.literal("sbp")]),
});

type PaymentRequest = z.infer<typeof paymentRequestSchema>;

export const paymentPackage = tryCatch(async (req: Request, res: Response) => {
  const paymentData = req.body;
  try {
    paymentRequestSchema.parse(paymentData);
    const data = await fetchYooKassaPaymentPackage({
      cost: paymentData.cost,
      currency: paymentData.currency,
      userId: paymentData.userId,
      socialNicknameId: paymentData.socialNicknameId,
      packageId: paymentData.packageId,
      countPosts: paymentData.countPosts,
      type: paymentData.type,
    });
    res.status(200).json(data);
  } catch (err) {
    logger.error((err as Error).stack);
    return res.status(404).json({
      message: "Payments error",
      error: err,
    });
  }
});

const fetchYooKassaPaymentPackage = async ({
  cost,
  currency,
  userId,
  socialNicknameId,
  packageId,
  countPosts,
  type,
}: PaymentRequest) => {
  const base64auth = btoa(
    `${process.env.YOO_KASSA_SHOP_ID}:${process.env.YOO_KASSA_API_KEY}`,
  );
  const response = await axios.post(
    `https://api.yookassa.ru/v3/payments`,
    {
      amount: {
        value: cost,
        currency: currency,
      },
      metadata: {
        user_id: userId,
        soc_nickname_id: socialNicknameId,
        package_id: packageId,
        count_posts: countPosts,
      },
      capture: true,
      payment_method_data: {
        type: type,
      },
      confirmation: {
        type: "redirect",
        return_url: process.env.CORS_ORIGIN,
      },
    },
    {
      headers: {
        Authorization: `Basic ${base64auth}`,
        "Content-Type": "application/json",
        "Idempotence-Key": uuidv4(),
      },
    },
  );
  return response.data;
};
