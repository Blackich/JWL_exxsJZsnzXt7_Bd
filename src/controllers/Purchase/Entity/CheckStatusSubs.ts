import { db } from "@src/main";
import { Request, Response } from "express";
import { PurchasePackage } from "@src/utils/types";
import { isArray, isString } from "@src/utils/utils";
import { logErr, tryCatch } from "@src/middleware/errorHandler";
import { checkServiceWQ } from "@src/controllers/Services/Wiq";
import { checkServiceVR } from "@src/controllers/Services/Venro";
import { checkServiceJP } from "@src/controllers/Services/JustPanel";

export const checkStatusAllSubs = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const allSubsByServiceId = await getAllPackageSubsByServiceId(Number(id));
    if (!isArray(allSubsByServiceId))
      return res.status(400).json({ message: "Services not found" });

    const result = await Promise.all(
      allSubsByServiceId.map(async (subscription: PurchasePackage) => {
        if (subscription.siteId === 1) {
          return checkServiceVR(subscription.orderId);
        }
        if (subscription.siteId === 2) {
          return checkServiceJP(subscription.orderId);
        }
      }),
    );
    return res.status(200).json(result);
  },
);

export const checkStatusForExtra = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const siteServiceInfo = await getSiteServiceInfoIdByExtraId(Number(id));
    if (!isString(siteServiceInfo))
      return res.status(400).json({
        message: "Extra not found",
      });

    const siteServiceInfoParsed: [number, number, number] =
      JSON.parse(siteServiceInfo);

    if (siteServiceInfoParsed[0] === 1) {
      const result = await checkServiceVR(siteServiceInfoParsed[2]);
      return res.status(200).json(result);
    }
    if (siteServiceInfoParsed[0] === 2) {
      const result = await checkServiceJP(siteServiceInfoParsed[2]);
      return res.status(200).json(result);
    }
    if (siteServiceInfoParsed[0] === 3) {
      const result = await checkServiceWQ(siteServiceInfoParsed[2]);
      return res.status(200).json(result);
    }

    return res.status(200).json({ message: "Extra not Id" });
  },
);

//--------------------------------------------------

export const getAllPackageSubsByServiceId = async (serviceId: number) => {
  return await db
    .promise()
    .query(
      `SELECT * FROM Purchase_package
        WHERE serviceId = ${serviceId}`,
    )
    .then(([result]) => result as PurchasePackage[])
    .catch((err) => logErr(err, "getAllPackageSubsByServiceId"));
};

export const getSiteServiceInfoIdByExtraId = async (extraId: number) => {
  return await db
    .promise()
    .query(
      `SELECT siteServiceInfo FROM Extra
        WHERE id = ${extraId}`,
    )
    .then(
      ([result]) =>
        (result as { siteServiceInfo: string }[])[0]?.siteServiceInfo,
    )
    .catch((err) => logErr(err, "getSiteServiceInfoIdByExtraId"));
};
