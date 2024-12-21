import { db } from "@src/main";
import { addServiceJP } from "@controllers/Services/JustPanel";
import { addServiceVR } from "@controllers/Services/Venro";
import { getRandomPercentage } from "@src/utils/utils";
import {
  getPackageById,
  getSocialNicknameById,
  packageSettings,
} from "@src/utils/intermediateReq";
import { RowDataPacket } from "mysql2";
import { logger } from "@src/utils/logger/logger";

export const purchasePackage = async (
  serviceId: number,
  nicknameId: number,
  packageId: number,
  countPosts: number,
) => {
  const settings = await packageSettings();
  const socNickname = await getSocialNicknameById(nicknameId);
  const pack = await getPackageById(packageId);
  if (
    !Array.isArray(settings) ||
    !("nickname" in socNickname) ||
    !("likes" in pack)
  )
    return;

  const purchaseSettings = settings.map((setting) => {
    const quantity = setting.ratio * pack.likes;
    if (setting.siteId === 1) {
      const count =
        quantity < 100
          ? Math.round(100 + getRandomPercentage(pack.likes, 0, 0.02))
          : Math.round(quantity + getRandomPercentage(quantity, 0, 0.02));
      const speed = Math.round(count / 24);
      return {
        siteId: setting.siteId,
        serviceId: setting.serviceId,
        count: count,
        speed,
      };
    }
    if (setting.siteId === 2) {
      const min = quantity < 100 ? 100 : quantity;
      const max = quantity < 100 ? 115 : Math.round(quantity + quantity * 0.02);
      return {
        siteId: setting.siteId,
        serviceId: setting.serviceId,
        min,
        max,
      };
    }
  });

  return await Promise.allSettled(
    purchaseSettings.map(async (setting) => {
      if (setting && setting.siteId === 1) {
        return await addServiceVR(
          socNickname.nickname,
          setting.serviceId,
          setting.count as number,
          countPosts,
          setting.speed as number,
        );
      }
      if (setting && setting.siteId === 2) {
        return await addServiceJP(
          socNickname.nickname,
          setting.serviceId,
          setting.min as number,
          setting.max as number,
          countPosts,
        );
      }
    }),
  )
    .then((response) => {
      return response.map(async (res) => {
        if (res.status === "fulfilled" && res.value?.siteId === 1) {
          return await addServicesOrder(
            serviceId,
            res.value?.siteId,
            res.value?.siteServiceId,
            res.value?.data.id,
          );
        }
        if (res.status === "fulfilled" && res.value?.siteId === 2) {
          return await addServicesOrder(
            serviceId,
            res.value?.siteId,
            res.value?.siteServiceId,
            res.value?.data.order,
          );
        }
      });
    })
    .catch((err) => logger.error(err.stack));
};

//--------------------------------------------------

export const addServicesOrder = async (
  serviceId: number,
  siteId: number,
  siteServiceId: number,
  orderId: number,
) => {
  const data = await db
    .promise()
    .query(
      `INSERT INTO Purchase_package (id, serviceId, siteId,
        siteServiceId, orderId) 
        VALUES(null, ${serviceId}, ${siteId},
          ${siteServiceId}, ${orderId})`,
    )
    .then(([result]) => {
      return result as RowDataPacket[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
