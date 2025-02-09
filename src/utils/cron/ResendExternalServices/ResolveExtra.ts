import { logErr } from "@src/middleware/errorHandler";
import { updateRejectedServiceStatus } from "./Settings";
import { addExtraServiceWQ } from "@src/controllers/Services/Wiq";
import { addExtraServiceVR } from "@src/controllers/Services/Venro";
import { addExtraServiceJP } from "@src/controllers/Services/JustPanel";
import { updateSiteOrderIdForExtraService } from "@src/controllers/Purchase/PurchaseExtra";
import {
  ExtraSettings,
  ExtraSettingsJP,
  ExtraSettingsVR,
  ExtraSettingsWQ,
} from "./types";

export const resolveExtra = async (
  settings: ExtraSettings,
  rejectExtId: number,
) => {
  if (!settings) return;

  if (settings.siteId === 1) {
    const settingsVR = settings as ExtraSettingsVR;
    return await addExtraServiceVR(
      settingsVR.nickname,
      settingsVR.siteServiceId,
      settingsVR.count,
      settingsVR.speed,
    )
      .then(async (res) => {
        if (!res.id) throw new Error("Order not created");
        await updateRejectedServiceStatus(rejectExtId);
        await updateSiteOrderIdForExtraService(
          settingsVR.tableExtraId,
          settingsVR.siteId,
          settingsVR.siteServiceId,
          res.id,
        );
        return;
      })
      .catch((err) => logErr(err, "resolveExtra/addExtraServiceVR"));
  }

  if (settings.siteId === 2) {
    const settingsJP = settings as ExtraSettingsJP;
    return await addExtraServiceJP(
      settingsJP.nickname,
      settingsJP.siteServiceId,
      settingsJP.count,
    )
      .then(async (res) => {
        if (!res.order) throw new Error("Order not created");
        await updateRejectedServiceStatus(rejectExtId);
        await updateSiteOrderIdForExtraService(
          settingsJP.tableExtraId,
          settingsJP.siteId,
          settingsJP.siteServiceId,
          res.order,
        );
        return;
      })
      .catch((err) => logErr(err, "resolveExtra/addExtraServiceJP"));
  }

  if (settings.siteId === 3) {
    const settingsWQ = settings as ExtraSettingsWQ;
    return await addExtraServiceWQ(
      settingsWQ.nickname,
      settingsWQ.siteServiceId,
      settingsWQ.count,
    )
      .then(async (res) => {
        if (!res.order) throw new Error("Order not created");
        await updateRejectedServiceStatus(rejectExtId);
        await updateSiteOrderIdForExtraService(
          settingsWQ.tableExtraId,
          settingsWQ.siteId,
          settingsWQ.siteServiceId,
          res.order,
        );
        return;
      })
      .catch((err) => logErr(err, "resolveExtra/addExtraServiceWQ"));
  }
  return;
};
