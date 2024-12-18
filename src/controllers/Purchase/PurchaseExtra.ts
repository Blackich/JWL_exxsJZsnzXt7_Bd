import { db } from "@src/main";
import { getSocialNicknameById } from "@src/utils/intermediateReq";
import { logger } from "@src/utils/logger/logger";
import { ExtraSettings } from "./type";
import { Logger } from "winston";
import { addExtraServiceVR } from "../Services/Venro";
import { SocialNickname } from "@src/utils/types";
import { addExtraServiceJP } from "../Services/JustPanel";
import { addExtraServiceWQ } from "../Services/Wiq";

const isSettingsArray = (
  arg: ExtraSettings[] | Logger,
): arg is ExtraSettings[] => {
  return Array.isArray(arg) && arg.every((item) => "serviceId" in item);
};

export const purchaseExtra = async (
  extraId: number,
  nicknameId: number,
  extraServiceId: number,
  count: number,
) => {
  const { nickname } = (await getSocialNicknameById(
    nicknameId,
  )) as SocialNickname;
  const settings = await getSettingsByExtraServiceId(extraServiceId);
  if (!isSettingsArray(settings) || !nickname) return;
  const setting = settings[0];
  const speedVR = Math.round(count / 24);
  const quantityJP = Math.round(count / 20);

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
      return result as ExtraSettings[];
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
