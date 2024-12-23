import { db } from "@src/main";
import { Logger } from "winston";
import { logger } from "@src/utils/logger/logger";
import { getServiceDetailsWQ } from "@src/controllers/Services/Wiq";
import { getServiceDetailsVR } from "@src/controllers/Services/Venro";
import { getServiceDetailsJP } from "@src/controllers/Services/JustPanel";
import { DatabaseServiceSettings, ExternalServiceSettings } from "./type";

const isExternalDataExists = (
  args: ExternalServiceSettings[],
): args is ExternalServiceSettings[] => {
  return Array.isArray(args) && args.every((arg) => "name" in arg);
};

const isDbDataExists = (
  args: DatabaseServiceSettings[] | Logger,
): args is DatabaseServiceSettings[] => {
  return Array.isArray(args) && args.every((arg) => "cost" in arg);
};

export const getAllSettings = async () => {
  try {
    const servicesVR = await getServiceDetailsVR();
    const servicesJP = await getServiceDetailsJP();
    const servicesWQ = await getServiceDetailsWQ();
    const packageSettings = await getPackageSettings();
    const extraServiceSettings = await getExtraServiceSettings();
    const testServiceSettings = await getTestServiceSettings();

    if (!isExternalDataExists(servicesVR)) return null;
    if (!isExternalDataExists(servicesJP)) return null;
    if (!isExternalDataExists(servicesWQ)) return null;
    if (!isDbDataExists(packageSettings)) return null;
    if (!isDbDataExists(extraServiceSettings)) return null;
    if (!isDbDataExists(testServiceSettings)) return null;

    return {
      servicesVR,
      servicesJP,
      servicesWQ,
      packageSettings,
      extraServiceSettings,
      testServiceSettings,
    };
  } catch (err) {
    logger.error((err as Error).stack);
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
    .catch((err) => logger.error(err.stack));
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
    .catch((err) => logger.error(err.stack));
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
    .catch((err) => logger.error(err.stack));
};
