import axios from "axios";
import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import { logger } from "@src/utils/logger/logger";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const paymentRequestSchema = z.object({
  count: z.number(),
  userId: z.number(),
  priceRUB: z.number(),
  priceUSD: z.number(),
  serviceId: z.number(),
  socialNicknameId: z.number(),
  type: z.union([z.literal("bank_card"), z.literal("sbp")]),
});

type PaymentRequest = z.infer<typeof paymentRequestSchema>;

export const paymentExtra = tryCatch(async (req: Request, res: Response) => {
  const paymentData = req.body;
  try {
    paymentRequestSchema.parse(paymentData);
    const data = await fetchYooKassaPaymentExtra({
      type: paymentData.type,
      count: paymentData.count,
      userId: paymentData.userId,
      priceRUB: paymentData.priceRUB,
      priceUSD: paymentData.priceUSD,
      serviceId: paymentData.serviceId,
      socialNicknameId: paymentData.socialNicknameId,
    });
    res.status(200).json(data);
  } catch (err) {
    logger.error("paymentExtra", { err });
    return res.status(404).json({
      message: "Payments error",
      error: err,
    });
  }
});

const fetchYooKassaPaymentExtra = async ({
  type,
  count,
  userId,
  priceRUB,
  priceUSD,
  serviceId,
  socialNicknameId,
}: PaymentRequest) => {
  const base64auth = btoa(
    `${process.env.YOO_KASSA_SHOP_ID}:${process.env.YOO_KASSA_API_KEY}`,
  );
  const response = await axios.post(
    `https://api.yookassa.ru/v3/payments`,
    {
      amount: {
        value: priceRUB,
        currency: "RUB",
      },
      metadata: {
        count,
        userId,
        priceRUB,
        priceUSD,
        serviceId,
        socialNicknameId,
        serviceName: "extra",
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
