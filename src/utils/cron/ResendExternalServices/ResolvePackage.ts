import { logErr } from "@src/middleware/errorHandler";
import { updateRejectedServiceStatus } from "./Settings";
import { addServiceVR } from "@src/controllers/Services/Venro";
import { addServiceJP } from "@src/controllers/Services/JustPanel";
import { addServicesOrder } from "@src/controllers/Purchase/PurchasePack";
import { PackageSettings, PackageSettingsJP, PackageSettingsVR } from "./type";

export const resolvePackage = async (
  settings: PackageSettings,
  rejectExtId: number,
) => {
  if (!settings) return;

  if (settings.siteId === 1) {
    const settingsVR = settings as PackageSettingsVR;
    return await addServiceVR(
      settingsVR.nickname,
      settingsVR.siteServiceId,
      settingsVR.count,
      settingsVR.countPosts,
      settingsVR.speed,
    )
      .then(async (res) => {
        if (!res.id) throw new Error("Order not created");
        await updateRejectedServiceStatus(rejectExtId);
        await addServicesOrder(
          settingsVR.tableServiceId,
          settingsVR.siteId,
          settingsVR.siteServiceId,
          res.id,
        );
        return;
      })
      .catch((err) => logErr(err, "resolvePackage/addServiceVR"));
  }

  if (settings.siteId === 2) {
    const settingsJP = settings as PackageSettingsJP;
    return await addServiceJP(
      settingsJP.nickname,
      settingsJP.siteServiceId,
      settingsJP.min,
      settingsJP.max,
      settingsJP.countPosts,
    )
      .then(async (res) => {
        if (!res.order) throw new Error("Order not created");
        await updateRejectedServiceStatus(rejectExtId);
        await addServicesOrder(
          settingsJP.tableServiceId,
          settingsJP.siteId,
          settingsJP.siteServiceId,
          res.order,
        );
        return;
      })
      .catch((err) => logErr(err, "resolvePackage/addServiceJP"));
  }
  return;
};
