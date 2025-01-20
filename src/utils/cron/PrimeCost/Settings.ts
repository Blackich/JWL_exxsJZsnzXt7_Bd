import { db } from "@src/main";
import { isArray } from "@src/utils/utils";
import { logger } from "@src/utils/logger/logger";
import { logErr } from "@src/middleware/errorHandler";
import { getServiceDetailsWQ } from "@src/controllers/Services/Wiq";
import { getServiceDetailsVR } from "@src/controllers/Services/Venro";
import { getServiceDetailsJP } from "@src/controllers/Services/JustPanel";
import { DatabaseServiceSettings, ExternalServiceSettings } from "./type";

export const getAllSettings = async () => {
  try {
    const packageSettings = await getPackageSettings();
    const testServiceSettings = await getTestServiceSettings();
    const extraServiceSettings = await getExtraServiceSettings();
    const servicesVR: ExternalServiceSettings[] = await getServiceDetailsVR();
    const servicesJP: ExternalServiceSettings[] = await getServiceDetailsJP();
    const servicesWQ: ExternalServiceSettings[] = await getServiceDetailsWQ();

    if (!isArray(servicesVR)) return;
    if (!isArray(servicesJP)) return;
    if (!isArray(servicesWQ)) return;
    if (!isArray(packageSettings)) return;
    if (!isArray(testServiceSettings)) return;
    if (!isArray(extraServiceSettings)) return;

    return {
      servicesVR,
      servicesJP,
      servicesWQ,
      packageSettings,
      extraServiceSettings,
      testServiceSettings,
    };
  } catch (err) {
    logger.error("PrimeCost/getAllSettings", { err });
  }
};

//--------------------------------------------------

const getPackageSettings = async () => {
  return await db
    .promise()
    .query(
      `SELECT id, siteId, serviceId, cost 
        FROM Package_setting`,
    )
    .then(([result]) => {
      return result as DatabaseServiceSettings[];
    })
    .catch((err) => logErr(err, "PrimeCost/getPackageSettings"));
};

const getExtraServiceSettings = async () => {
  return await db
    .promise()
    .query(
      `SELECT id, siteId, serviceId, cost
        FROM Extra_service_setting`,
    )
    .then(([result]) => {
      return result as DatabaseServiceSettings[];
    })
    .catch((err) => logErr(err, "PrimeCost/getExtraServiceSettings"));
};

const getTestServiceSettings = async () => {
  return await db
    .promise()
    .query(
      `SELECT id, siteId, serviceId, cost
        FROM Test_service_setting`,
    )
    .then(([result]) => {
      return result as DatabaseServiceSettings[];
    })
    .catch((err) => logErr(err, "PrimeCost/getTestServiceSettings"));
};
