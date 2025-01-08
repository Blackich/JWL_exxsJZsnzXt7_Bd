import { addServicesOrder } from "./PurchasePack";
import { getRandomPercentage } from "@src/utils/utils";
import { addServiceVR } from "@controllers/Services/Venro";
import { addServiceJP } from "@controllers/Services/JustPanel";
import { saveRejectedService } from "./Entity/SaveRejectExternal";
import {
  getCustomPackageDetailsById,
  getSocialNicknameById,
  packageSettings,
} from "@src/utils/intermediateReq";

export const purchaseCustomPackage = async (
  insertId: number,
  nicknameId: number,
  customPackageId: number,
  countPosts: number,
) => {
  const packSettings = await packageSettings();
  const socNickname = await getSocialNicknameById(nicknameId);
  const customPackDeatils = await getCustomPackageDetailsById(customPackageId);
  if (
    !Array.isArray(packSettings) ||
    !(typeof socNickname === "string") ||
    !("likes" in customPackDeatils)
  )
    return;

  const correlationPack = packSettings.map((setting) => {
    const nameService = setting.typeService;
    return {
      ...setting,
      count:
        customPackDeatils[nameService as keyof typeof customPackDeatils] || 100,
    };
  });

  const purchaseSettings = correlationPack.map((setting) => {
    const quantity = setting.count;
    if (setting.siteId === 1) {
      const count =
        quantity < 100
          ? Math.round(100 + getRandomPercentage(quantity, 0, 0.02))
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
      const min = quantity <= 100 ? 100 : quantity;
      const max =
        quantity <= 100 ? 115 : Math.round(quantity + quantity * 0.02);
      return {
        siteId: setting.siteId,
        serviceId: setting.serviceId,
        min,
        max,
      };
    }
  });

  return purchaseSettings.map(async (setting) => {
    if (setting && setting.siteId === 1) {
      return await addServiceVR(
        socNickname,
        setting.serviceId,
        setting.count as number,
        countPosts,
        setting.speed as number,
      )
        .then(async (res) => {
          console.log(res, "resp VR CustPack");
          if (!res.id) throw new Error("No id");
          return await addServicesOrder(
            insertId,
            setting.siteId,
            setting.serviceId,
            res.id,
          );
        })
        .catch(async () => {
          const extSettCustomPackVR = {
            serviceName: "Pack",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            nickname: socNickname,
            countPosts: countPosts,
            count: setting.count as number,
            speed: setting.speed as number,
          };
          return await saveRejectedService(extSettCustomPackVR);
        });
    }
    if (setting && setting.siteId === 2) {
      return await addServiceJP(
        socNickname,
        setting.serviceId,
        setting.min as number,
        setting.max as number,
        countPosts,
      )
        .then(async (res) => {
          console.log(res, "resp JP CustPack");
          if (!res.order) throw new Error("No order");
          return await addServicesOrder(
            insertId,
            setting.siteId,
            setting.serviceId,
            res.order,
          );
        })
        .catch(async () => {
          const extSettCustomPackJP = {
            serviceName: "Pack",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            nickname: socNickname,
            countPosts: countPosts,
            min: setting.min as number,
            max: setting.max as number,
          };
          return await saveRejectedService(extSettCustomPackJP);
        });
    }
  });
};
