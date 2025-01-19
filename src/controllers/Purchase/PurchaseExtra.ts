import { db } from "@src/main";
import { ExtraSettings } from "./type";
import { isObject, isString } from "@src/utils/utils";
import { logErr } from "@src/middleware/errorHandler";
import { addExtraServiceWQ } from "@controllers/Services/Wiq";
import { addExtraServiceVR } from "@controllers/Services/Venro";
import { saveRejectedService } from "./Entity/SaveRejectExternal";
import { getSocialNicknameById } from "@src/utils/intermediateReq";
import { addExtraServiceJP } from "@controllers/Services/JustPanel";

export const purchaseExtra = async (
  extraId: number,
  nicknameId: number,
  extraServiceId: number,
  count: number,
) => {
  const socNickname = await getSocialNicknameById(nicknameId);
  const setting = await getSettingsByExtraServiceId(extraServiceId);
  if (!isString(socNickname)) return;
  if (!isObject(setting)) return;

  const speedVR = Math.round(count / 24);
  const quantityJP = Math.round(count / 10);

  if (setting.siteId === 1) {
    return await addExtraServiceVR(
      socNickname,
      setting.serviceId,
      count,
      speedVR,
    )
      .then(async (res) => {
        console.log(res, "resp Extra VR");
        if (!res.id) throw new Error("Order not created");
        return await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.id,
        );
      })
      .catch(async () => {
        const extSettExtraVR = {
          serviceName: "Extra",
          siteId: setting.siteId,
          siteServiceId: setting.serviceId,
          nickname: socNickname,
          speed: speedVR,
          count: count,
          tableExtraId: extraId,
        };
        return await saveRejectedService(extSettExtraVR);
      });
  }

  if (setting.siteId === 2) {
    return await addExtraServiceJP(socNickname, setting.serviceId, quantityJP)
      .then(async (res) => {
        console.log(res, "resp Extra JP");
        if (!res.order) throw new Error("Order not created");
        return await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.order,
        );
      })
      .catch(async () => {
        const extSettExtraJP = {
          serviceName: "Extra",
          siteId: setting.siteId,
          siteServiceId: setting.serviceId,
          nickname: socNickname,
          count: quantityJP,
          tableExtraId: extraId,
        };
        return await saveRejectedService(extSettExtraJP);
      });
  }

  if (setting.siteId === 3) {
    return await addExtraServiceWQ(socNickname, setting.serviceId, count)
      .then(async (res) => {
        console.log(res, "resp Extra WQ");
        if (!res.order) throw new Error("Order not created");
        return await updateSiteOrderIdForExtraService(
          extraId,
          setting.siteId,
          setting.serviceId,
          res.order,
        );
      })
      .catch(async () => {
        const extSettExtraWQ = {
          serviceName: "Extra",
          siteId: setting.siteId,
          siteServiceId: setting.serviceId,
          nickname: socNickname,
          count: count,
          tableExtraId: extraId,
        };
        return await saveRejectedService(extSettExtraWQ);
      });
  }
};

//--------------------------------------------------

export const getSettingsByExtraServiceId = async (extraServiceId: number) => {
  return await db
    .promise()
    .query(
      `SELECT serviceId, siteId
        FROM Extra_service_setting
        WHERE extraServiceId = ${extraServiceId}
        AND status = 1`,
    )
    .then(([result]) => (result as ExtraSettings[])[0])
    .catch((err) => logErr(err, "getSettingsByExtraServiceId"));
};

export const updateSiteOrderIdForExtraService = async (
  extraId: number,
  siteId: number,
  siteServiceId: number,
  siteOrderId: number,
) => {
  const siteServiceInfo = JSON.stringify([siteId, siteServiceId, siteOrderId]);
  return await db
    .promise()
    .query(
      `UPDATE Extra
        SET siteServiceInfo = '${siteServiceInfo}'
        WHERE id = ${extraId}`,
    )
    .then(([result]) => result)
    .catch((err) => logErr(err, "updateSiteOrderIdForExtraService"));
};
