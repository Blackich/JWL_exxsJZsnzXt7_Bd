import { db } from "@src/main";
import { logErr } from "@src/middleware/errorHandler";
import { getRandomPercentage } from "@src/utils/utils";
import { addServiceVR } from "@controllers/Services/Venro";
import { isArray, isObject, isString } from "@src/utils/utils";
import { addServiceJP } from "@controllers/Services/JustPanel";
import { saveRejectedService } from "./Entity/SaveRejectExternal";
import {
  getPackageDetailsById,
  getSocialNicknameById,
  packageSettings,
} from "@src/utils/intermediateReq";

export const purchasePackage = async (
  insertId: number,
  nicknameId: number,
  packageId: number,
  countPosts: number,
) => {
  const packSettings = await packageSettings();
  const socNickname = await getSocialNicknameById(nicknameId);
  const packDetails = await getPackageDetailsById(packageId);
  if (!isArray(packSettings)) return;
  if (!isString(socNickname)) return;
  if (!isObject(packDetails)) return;

  const purchaseSettings = packSettings.map((setting) => {
    const quantity = setting.ratio * packDetails.likes;
    if (setting.siteId === 1) {
      const count =
        quantity < 100
          ? Math.round(100 + getRandomPercentage(packDetails.likes, 0, 0.02))
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
          console.log(res, "resp VR Pack");
          if (!res.id) throw new Error("No id");
          return await addServicesOrder(
            insertId,
            setting.siteId,
            setting.serviceId,
            res.id,
          );
        })
        .catch(async () => {
          const extSettPackVR = {
            serviceName: "Pack",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            nickname: socNickname,
            countPosts: countPosts,
            count: setting.count as number,
            speed: setting.speed as number,
            tableServiceId: insertId,
          };
          return await saveRejectedService(extSettPackVR);
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
          console.log(res, "resp JP Pack");
          if (!res.order) throw new Error("No order");
          return await addServicesOrder(
            insertId,
            setting.siteId,
            setting.serviceId,
            res.order,
          );
        })
        .catch(async () => {
          const extSettPackJP = {
            serviceName: "Pack",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            nickname: socNickname,
            countPosts: countPosts,
            min: setting.min as number,
            max: setting.max as number,
            tableServiceId: insertId,
          };
          return await saveRejectedService(extSettPackJP);
        });
    }
  });
};

//--------------------------------------------------

export const addServicesOrder = async (
  serviceId: number,
  siteId: number,
  siteServiceId: number,
  orderId: number,
) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Purchase_package (serviceId, siteId,
        siteServiceId, orderId) 
        VALUES(${serviceId}, ${siteId},
          ${siteServiceId}, ${orderId})`,
    )
    .catch((err) => logErr(err, "addServicesOrder"));
};
