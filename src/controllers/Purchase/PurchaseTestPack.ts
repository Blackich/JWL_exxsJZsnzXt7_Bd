import { addTestServiceJP } from "@controllers/Services/JustPanel";
import { addTestServiceVR } from "@controllers/Services/Venro";
import { logger } from "@src/utils/logger/logger";

export const purchaseTestPackage = async (
  testServiceId: number,
  link: string,
) => {
  const testPackage = testServiceId === 1 ? testPackForPost : testPackForVideo;

  return await Promise.allSettled(
    testPackage.map((testpack) => {
      if (testpack.siteId === 1) {
        return addTestServiceVR(
          link,
          testpack.serviceId,
          testpack.count,
          testpack.speed as number,
        );
      }
      if (testpack.siteId === 2) {
        return addTestServiceJP(link, testpack.serviceId, testpack.count);
      }
    }),
  ).catch((err) => logger.error(err.stack));
};

//--------------------------------------------------

const testPackForPost = [
  {
    typeService: "likes",
    serviceId: 13,
    siteId: 1,
    count: 507,
    speed: 25,
  },
  {
    typeService: "reach",
    serviceId: 106,
    siteId: 1,
    count: 1010,
    speed: 50,
  },
  {
    typeService: "saves",
    serviceId: 99,
    siteId: 1,
    count: 103,
    speed: 20,
  },
  {
    typeService: "profileVisits",
    serviceId: 7447,
    siteId: 2,
    count: 107,
  },
  {
    typeService: "reposts",
    serviceId: 6376,
    siteId: 2,
    count: 111,
  },
];

const testPackForVideo = testPackForPost.concat({
  typeService: "videoViews",
  serviceId: 798,
  siteId: 2,
  count: 1514,
});
