import { db } from "@src/main";
import { resolveTest } from "./ResolveTest";
import { resolveExtra } from "./ResolveExtra";
import { resolvePackage } from "./ResolvePackage";
import { logErr } from "@src/middleware/errorHandler";
import { СommonSettings, RejectExternal } from "./type";

export const customizeRejectServices = async () => {
  const rejectedServices = await getRejectedServices();
  if (!rejectedServices) return;

  return rejectedServices.map(async (service) => {
    const externalSetting = service.externalSetting as СommonSettings;
    const serviceName = externalSetting.serviceName;

    if (serviceName === "Pack") {
      await resolvePackage(externalSetting, service.id);
    }

    if (serviceName === "Extra") {
      await resolveExtra(externalSetting, service.id);
    }

    if (serviceName === "Test") {
      await resolveTest(externalSetting, service.id);
    }

    return;
  });
};

//--------------------------------------------------

export const getRejectedServices = async () => {
  return await db
    .promise()
    .query(
      `SELECT * FROM Reject_external
        WHERE status = 0`,
    )
    .then(([result]) =>
      (result as RejectExternal[]).map((reject_ext) => {
        return {
          ...reject_ext,
          externalSetting: JSON.parse(reject_ext.externalSetting as string),
        } as RejectExternal;
      }),
    )
    .catch((err) => logErr(err, "getRejectedServices"));
};

export const updateRejectedServiceStatus = async (rejectServiceId: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Reject_external 
        SET status = 1 
        WHERE id = ${rejectServiceId}`,
    )
    .then(([result]) => result)
    .catch((err) => logErr(err, "updateRejectedServiceStatus"));
};
