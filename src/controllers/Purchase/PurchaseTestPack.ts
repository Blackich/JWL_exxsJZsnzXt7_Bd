import { db } from "@src/main";
import { Logger } from "winston";
import { TestSettings } from "./type";
import { logger } from "@src/utils/logger/logger";

const isSettingsArray = (
  arg: TestSettings[] | Logger,
): arg is TestSettings[] => {
  return Array.isArray(arg) && arg.every((item) => "serviceId" in item);
};

export const purchaseTestPackage = async (
  testServiceId: number,
  speed: number,
  link: string,
) => {
  const settings = await getTestSettingsByServiceId(testServiceId);
  if (!isSettingsArray(settings)) return;

  return settings.map((setting) => {
    if (setting.typeService === "comments") {
      return {
        //Comments
        url: link,
        id: setting.serviceId,
      };
    }

    if (setting.siteId === 1) {
      const speedForVR = setSpeedForVR(speed, setting.count);
      //Venro
      return {
        url: link,
        id: setting.serviceId,
        count: setting.count,
        speed: speedForVR,
      };
    }
    if (setting.siteId === 2) {
      //Just Drip
      if (setting.drip === 1) {
        const speedForJP = setSpeedForJP(speed, setting.count);
        return {
          url: link,
          id: setting.serviceId,
          count: speedForJP.quantity,
          runs: speedForJP.runs,
        };
      } else {
        //Just NO Drip
        return {
          url: link,
          id: setting.serviceId,
          count: setting.count,
        };
      }
    }
    //Wiq
    if (setting.siteId === 3) {
      return {
        url: link,
        id: setting.serviceId,
        count: setting.count,
      };
    }
  });

  // return await Promise.allSettled(
  //   settings.map((setting) => {
  //     if (setting.siteId === 1) {
  //       return addTestServiceVR(
  //         link,
  //         setting.serviceId,
  //         setting.count,
  //         // testpack.speed as number,
  //       );
  //     }
  //     if (setting.siteId === 2) {
  //       return addTestServiceJP(link, setting.serviceId, setting.count);
  //     }
  //   }),
  // ).catch((err) => logger.error(err.stack));
};

//--------------------------------------------------

export const getTestSettingsByServiceId = async (testServiceId: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT typeService, serviceId,
        siteId, count, drip
        FROM Test_service_setting
        WHERE testServiceId  = ${testServiceId}`,
    )
    .then(([result]) => {
      return result as TestSettings[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const setSpeedForVR = (speed: number, count: number) => {
  switch (speed) {
    case 1:
      return count;
    case 2:
      return Math.round(count / 2);
    case 3:
      return Math.round(count / 3);
    case 4:
      return 0;
    default:
      return 0;
  }
};

const setSpeedForJP = (speed: number, count: number) => {
  switch (speed) {
    case 1:
      return { runs: 2, quantity: Math.round(count / 2) };
    case 2:
      return { runs: 4, quantity: Math.round(count / 4) };
    case 3:
      return { runs: 6, quantity: Math.round(count / 6) };
    case 4:
      return { runs: 1, quantity: count };
    default:
      return { runs: 1, quantity: count };
  }
};
