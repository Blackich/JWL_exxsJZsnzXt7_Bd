import { CancelSettings } from "./types";
import { updateRejectedServiceStatus } from "./Settings";
import { cancelServiceVR } from "@src/controllers/Services/Venro";
import { cancelServiceJP } from "@src/controllers/Services/JustPanel";

export const resolveCancel = async (
  settings: CancelSettings,
  rejectExtId: number,
) => {
  if (!settings) return;

  if (settings.siteId === 1) {
    const status = await cancelServiceVR(settings.orderId);
    if (!status || status !== 200) return;
    await updateRejectedServiceStatus(rejectExtId);
  }
  if (settings.siteId === 2) {
    const status = await cancelServiceJP(settings.orderId);
    if (!status || status !== 200) return;
    await updateRejectedServiceStatus(rejectExtId);
  }

  return;
};
