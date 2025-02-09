import { logErr } from "@src/middleware/errorHandler";
import { updateRejectedServiceStatus } from "./Settings";
import { addTestServiceWQ } from "@src/controllers/Services/Wiq";
import { addTestServiceVR } from "@src/controllers/Services/Venro";
import {
  addTestServiceJP,
  addTestServiceJPNoDrip,
} from "@src/controllers/Services/JustPanel";
import {
  TestSettings,
  TestSettingsJPDrip,
  TestSettingsJPNoDrip,
  TestSettingsVR,
  TestSettingsWQ,
} from "./types";

export const resolveTest = async (
  settings: TestSettings,
  rejectExtId: number,
) => {
  if (!settings) return;

  if (settings.siteId === 1) {
    const settingsVR = settings as TestSettingsVR;
    return await addTestServiceVR(
      settingsVR.link,
      settingsVR.siteServiceId,
      settingsVR.count,
      settingsVR.speed,
    )
      .then(async (res) => {
        if (!res.id) throw new Error("Order not created");
        return await updateRejectedServiceStatus(rejectExtId);
      })
      .catch((err) => logErr(err, "resolveTest/addTestServiceVR"));
  }

  if (settings.siteId === 2) {
    const settingsJP = settings as TestSettingsJPDrip | TestSettingsJPNoDrip;
    if (settingsJP.drip === 1) {
      const settingsJPDrip = settings as TestSettingsJPDrip;
      return await addTestServiceJP(
        settingsJPDrip.link,
        settingsJPDrip.siteServiceId,
        settingsJPDrip.count,
        settingsJPDrip.runs,
      )
        .then(async (res) => {
          if (!res.order) throw new Error("Order not created");
          return await updateRejectedServiceStatus(rejectExtId);
        })
        .catch((err) => logErr(err, "resolveTest/addTestServiceJP"));
    } else {
      const settingsJPNoDrip = settings as TestSettingsJPNoDrip;
      return await addTestServiceJPNoDrip(
        settingsJPNoDrip.link,
        settingsJPNoDrip.siteServiceId,
        settingsJPNoDrip.count,
      )
        .then(async (res) => {
          if (!res.order) throw new Error("Order not created");
          return await updateRejectedServiceStatus(rejectExtId);
        })
        .catch((err) => logErr(err, "resolveTest/addTestServiceJPNoDrip"));
    }
  }

  if (settings.siteId === 3) {
    const settingsWQ = settings as TestSettingsWQ;
    return await addTestServiceWQ(
      settingsWQ.link,
      settingsWQ.siteServiceId,
      settingsWQ.count,
    )
      .then(async (res) => {
        if (!res.order) throw new Error("Order not created");
        return await updateRejectedServiceStatus(rejectExtId);
      })
      .catch((err) => logErr(err, "resolveTest/addTestServiceWQ"));
  }

  return;
};
