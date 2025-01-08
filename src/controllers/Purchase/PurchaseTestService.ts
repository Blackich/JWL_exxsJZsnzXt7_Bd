import { db } from "@src/main";
import { Logger } from "winston";
import { TestSettings } from "./type";
import { logger } from "@src/utils/logger/logger";
import { addTestServiceWQ } from "@controllers/Services/Wiq";
import { addTestServiceVR } from "@controllers/Services/Venro";
import { saveRejectedService } from "./Entity/SaveRejectExternal";
import {
  addTestServiceJP,
  addTestServiceJPNoDrip,
  sendCommentsServiceJP,
} from "@controllers/Services/JustPanel";

const isSettingsArray = (
  arg: TestSettings[] | Logger,
): arg is TestSettings[] => {
  return Array.isArray(arg) && arg.every((item) => "serviceId" in item);
};

export const purchaseTestService = async (
  testServiceId: number,
  speed: number,
  link: string,
  comments: string[],
) => {
  const settings = await getTestSettingsByServiceId(testServiceId);
  if (!isSettingsArray(settings)) return;

  const promises = settings.map(async (setting) => {
    if (setting.typeService === "comments") {
      if (Array.isArray(comments) && comments && comments.length === 0) return;
      return await sendCommentsServiceJP(link, setting.serviceId, comments)
        .then(async (res) => {
          console.log(res, "resp Test Comments JP");
          if (!res.order) throw new Error("Order not created");
          return res;
        })
        .catch(async () => {
          console.log("ошибка отправки комментариев");
          return null;
        });
    }

    if (setting.siteId === 1) {
      const speedForVR = setSpeedForVR(speed, setting.count);
      return await addTestServiceVR(
        link,
        setting.serviceId,
        setting.count,
        speedForVR,
      )
        .then(async (res) => {
          if (!res.id) throw new Error("Order not created");
          return res;
        })
        .catch(async () => {
          const extSettTestVR = {
            serviceName: "Test",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            count: setting.count,
            speed: speedForVR,
            link: link,
          };
          return await saveRejectedService(extSettTestVR);
        });
    }

    if (setting.siteId === 2) {
      if (setting.drip === 1) {
        const speedForJP = setSpeedForJP(speed, setting.count);
        return await addTestServiceJP(
          link,
          setting.serviceId,
          speedForJP.quantity,
          speedForJP.runs,
        )
          .then(async (res) => {
            console.log(res, "resp Test JP DRIP");
            if (!res.order) throw new Error("Order not created");
            return res;
          })
          .catch(async () => {
            const extSettTestJPDrip = {
              serviceName: "Test",
              siteId: setting.siteId,
              siteServiceId: setting.serviceId,
              drip: setting.drip,
              count: speedForJP.quantity,
              runs: speedForJP.runs,
              link: link,
            };
            return await saveRejectedService(extSettTestJPDrip);
          });
      } else {
        return await addTestServiceJPNoDrip(
          link,
          setting.serviceId,
          setting.count,
        )
          .then(async (res) => {
            if (!res.order) throw new Error("Order not created");
            return res;
          })
          .catch(async () => {
            const extSettTestJPNoDrip = {
              serviceName: "Test",
              siteId: setting.siteId,
              siteServiceId: setting.serviceId,
              drip: setting.drip,
              count: setting.count,
              link: link,
            };
            return await saveRejectedService(extSettTestJPNoDrip);
          });
      }
    }

    if (setting.siteId === 3) {
      return await addTestServiceWQ(link, setting.serviceId, setting.count)
        .then(async (res) => {
          if (!res.order) throw new Error("Order not created");
          return res;
        })
        .catch(async () => {
          const extSettTestWQ = {
            serviceName: "Test",
            siteId: setting.siteId,
            siteServiceId: setting.serviceId,
            count: setting.count,
            link: link,
          };
          return await saveRejectedService(extSettTestWQ);
        });
    }
  });

  return await Promise.allSettled(promises);
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
