import { addServiceJP } from "@controllers/Services/JustPanel";
import { addServiceVR } from "@controllers/Services/Venro";
import { getRandomPercentage } from "@src/utils/utils";
import {
  getCustomPackageById,
  getSocialNicknameById,
  packageDetails,
} from "@src/utils/intermediateReq";
import { logger } from "@src/utils/logger/logger";
import { addServicesOrder } from "./PurchasePack";

export const purchaseCustomPackage = async (
  serviceId: number,
  nicknameId: number,
  customPackageId: number,
  countPosts: number,
) => {
  const details = await packageDetails();
  const socNickname = await getSocialNicknameById(nicknameId);
  const pack = await getCustomPackageById(customPackageId);
  if (
    !Array.isArray(details) ||
    !("nickname" in socNickname) ||
    !("likes" in pack)
  )
    return;

  const correlationPack = details.map((detail) => {
    const nameService = detail.typeService;
    return {
      ...detail,
      count: pack[nameService as keyof typeof pack],
    };
  });

  const purchaseSettings = correlationPack.map((detail) => {
    const quantity = detail.count;
    if (detail.siteId === 1) {
      const speed = 20;
      const count =
        quantity < 100
          ? Math.round(100 + getRandomPercentage(quantity, 0, 0.02))
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
};
