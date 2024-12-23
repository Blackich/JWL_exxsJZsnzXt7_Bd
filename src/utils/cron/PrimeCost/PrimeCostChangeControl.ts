import { db } from "@src/main";
import { getAllSettings } from "./Settings";
import { logger } from "@src/utils/logger/logger";
import { sendTGMessageCostChanges } from "./Telegram";
import {
  AllServiceSettings,
  DatabaseServiceSettings,
  ExternalServiceSettings,
  TableName,
  TableNameKey,
} from "./type";

export const primeCostChangeControl = async () => {
  try {
    const generalSettings = await getAllSettings();
    if (!generalSettings) return;
    const packSettings = generalSettings.packageSettings;
    const extraSettings = generalSettings.extraServiceSettings;
    const testSettings = generalSettings.testServiceSettings;

    packSettings.map(async (setting) => {
      return await searchBySiteId(generalSettings, setting, "pack");
    });
    extraSettings.map(async (setting) => {
      return await searchBySiteId(generalSettings, setting, "extra");
    });
    testSettings.map(async (setting) => {
      return await searchBySiteId(generalSettings, setting, "test");
    });

    return;
  } catch (err) {
    logger.error((err as Error).stack);
  }
};

const searchBySiteId = async (
  generalSettings: AllServiceSettings,
  setting: DatabaseServiceSettings,
  tableKey: TableNameKey,
) => {
  const servicesVR = generalSettings.servicesVR;
  const servicesJP = generalSettings.servicesJP;
  const servicesWQ = generalSettings.servicesWQ;

  if (setting.siteId === 1) {
    return await findExternalService(servicesVR, setting, tableKey);
  }
  if (setting.siteId === 2) {
    return await findExternalService(servicesJP, setting, tableKey);
  }
  if (setting.siteId === 3) {
    return await findExternalService(servicesWQ, setting, tableKey);
  }
};

const findExternalService = async (
  servSettings: ExternalServiceSettings[],
  setting: DatabaseServiceSettings,
  tableKey: TableNameKey,
) => {
  const extServ = servSettings.find(
    (ext_item) => Number(ext_item.service) === setting.serviceId,
  );
  if (!extServ) return;
  const rate = Number(extServ.rate);
  const cost = Number(setting.cost);
  if (cost !== rate) {
    await updateCost(tableKey, setting.id, rate);
    await sendTGMessageCostChanges({
      tableKey,
      was: cost,
      became: rate,
      siteId: setting.siteId,
      serviceName: extServ.name,
      siteServiceId: setting.serviceId,
    });
    return;
  }
};

//--------------------------------------------------

const updateCost = async (tableKey: TableNameKey, id: number, cost: number) => {
  return await db
    .promise()
    .query(
      `UPDATE ${
        TableName[`${tableKey}` as keyof typeof TableName]
      } SET cost = ${cost} WHERE id = ${id}`,
    )
    .catch((err) => logger.error(err.stack));
};
