import { db } from "@src/main";
import { ExtraSettings } from "./type";
import { SocialNickname } from "@src/utils/types";
import { logger } from "@src/utils/logger/logger";
import { addExtraServiceWQ } from "@controllers/Services/Wiq";
import { addExtraServiceVR } from "@controllers/Services/Venro";
import { getSocialNicknameById } from "@src/utils/intermediateReq";
import { addExtraServiceJP } from "@controllers/Services/JustPanel";

export const purchaseExtra = async (
  extraId: number,
  nicknameId: number,
  extraServiceId: number,
  count: number,
) => {
  const { nickname } = (await getSocialNicknameById(
    nicknameId,
  )) as SocialNickname;
  const setting = await getSettingsByExtraServiceId(extraServiceId);
  if (!("serviceId" in setting) || !nickname) return;
  const speedVR = Math.round(count / 24);
  const quantityJP = Math.round(count / 10);

  if (setting.siteId === 1) {
    await addExtraServiceVR(nickname, setting.serviceId, count, speedVR)
      .then(async (res) => {
        await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.id,
        );
      })
      .catch((err) => logger.error(err.stack));
  }
  if (setting.siteId === 2) {
    await addExtraServiceJP(nickname, setting.serviceId, quantityJP)
      .then(async (res) => {
        await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.order,
        );
      })
      .catch((err) => logger.error(err.stack));
  }
  if (setting.siteId === 3) {
    await addExtraServiceWQ(nickname, setting.serviceId, count)
      .then(async (res) => {
        await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.order,
        );
      })
      .catch((err) => logger.error(err.stack));
  }
};

//--------------------------------------------------

export const getSettingsByExtraServiceId = async (extraServiceId: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT serviceId, siteId
        FROM Extra_service_setting
        WHERE extraServiceId = ${extraServiceId}
        AND status = 1`,
    )
    .then(([result]) => {
      return (result as ExtraSettings[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const updateSiteOrderIdForExtraService = async (
  extraId: number,
  siteId: number,
  siteServiceId: number,
  siteOrderId: number,
) => {
  const data = await db
    .promise()
    .query(
      `UPDATE Extra
        SET siteServiceInfo = JSON_ARRAY(${siteId},
          ${siteServiceId}, ${siteOrderId})
          WHERE id = ${extraId}`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
