import { db } from "@src/main";
import { addServiceJP } from "@controllers/Services/JustPanel";
import { addServiceVR } from "@controllers/Services/Venro";
import { getRandomPercentage } from "@src/utils/utils";
import {
  getPackageById,
  getSocialNicknameById,
  packageDetails,
} from "@src/utils/intermediateReq";
import { RowDataPacket } from "mysql2";
import { logger } from "@src/utils/logger/logger";

export const purchasePackage = async (
  serviceId: number,
  nicknameId: number,
  packageId: number,
  countPosts: number,
) => {
  const details = await packageDetails();
  const socNickname = await getSocialNicknameById(nicknameId);
  const pack = await getPackageById(packageId);
  if (
    !Array.isArray(details) ||
    !("nickname" in socNickname) ||
    !("likes" in pack)
  )
    return;

  const purchaseSettings = details.map((detail) => {
    const quantity = detail.ratio * pack.likes;
    if (detail.siteId === 1) {
      const speed = 20;
      const count =
        quantity < 100
          ? Math.round(100 + getRandomPercentage(pack.likes, 0, 0.02))
          : Math.round(quantity + getRandomPercentage(quantity, 0, 0.02));
      return {
        siteId: detail.siteId,
        serviceId: detail.serviceId,
        count: count,
        speed,
      };
    }
    if (detail.siteId === 2) {
      const min = quantity < 100 ? 100 : quantity;
      const max = quantity < 100 ? 115 : Math.round(quantity + quantity * 0.02);
      return {
        siteId: detail.siteId,
        serviceId: detail.serviceId,
        min,
        max,
      };
    }
  });

  return await Promise.allSettled(
    purchaseSettings.map((setting) => {
      if (setting && setting.siteId === 1) {
        return addServiceVR(
          socNickname.nickname,
          setting.serviceId,
          setting.count as number,
          countPosts,
          setting.speed as number,
        );
      }
      if (setting && setting.siteId === 2) {
        return addServiceJP(
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
      return response.map((res) => {
        if (res.status === "fulfilled" && res.value?.siteId === 1) {
          return addServicesOrder(
            serviceId,
            res.value?.siteId,
            res.value?.siteServiceId,
            res.value?.data.id,
          );
        }
        if (res.status === "fulfilled" && res.value?.siteId === 2) {
          return addServicesOrder(
            serviceId,
            res.value?.siteId,
            res.value?.siteServiceId,
            res.value?.data.order,
          );
        }
      });
    })
    .catch((err) => logger.error(err.stack));

  //   try {
  //     const likes = await addServiceVR(url, 13, 500, 3, 50);
  //     const reach = await addServiceVR(url, 106, 500, 3, 50);
  //     const saves = await addServiceVR(url, 99, 500, 3, 50);
  //     const profileVisits = await addServiceJP(url, 7447, 200, 250, 2);
  //     const viewsVideo = await addServiceJP(url, 6, 500, 3, 50);
  //     const reposts = await addServiceJP(url, 6376, 30, 35, 2);
  //     return {
  //       likes: likes,
  //       reach: reach,
  //       saves: saves,
  //       profileVisits: profileVisits,
  //       reposts: reposts,
  //       viewsVideo: viewsVideo,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
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
