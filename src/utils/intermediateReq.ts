import { db } from "@src/main";
import { logger } from "./logger/logger";
import {
  CustomPackageDetails,
  PackageDetails,
  SocialNickname,
  PackageSettings,
} from "./types";

export const getPackageDetailsById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT * FROM Package_detail WHERE id = ${id}`)
    .then(([result]) => {
      return (result as PackageDetails[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const getSocialNicknameById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT * FROM Social_nickname WHERE id = ${id}`)
    .then(([result]) => {
      return (result as SocialNickname[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const getCustomPackageDetailsById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT * FROM Custom_package_detail WHERE id = ${id}`)
    .then(([result]) => {
      return (result as CustomPackageDetails[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const packageSettings = async () => {
  const data = await db
    .promise()
    .query(
      `SELECT * FROM Package_setting
        WHERE status = 1`,
    )
    .then(([result]) => {
      return result as PackageSettings[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const getExtraServiceNameByExtraId = async (extraServiceId: number) => {
  const data = await db
    .promise()
    .query(
      `SELECT serviceName FROM Extra_service
        WHERE id = ${extraServiceId}`,
    )
    .then(([result]) => {
      return (result as { serviceName: string }[])[0].serviceName;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
