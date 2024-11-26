import { db } from "@src/main";
import { logger } from "./logger/logger";
import {
  CustomPackage,
  Package,
  SocialNickname,
  PackageDetails,
} from "./types";

export const getPackageById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT * FROM Package WHERE id = ${id}`)
    .then(([result]) => {
      return (result as Package[])[0];
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

export const getCustomPackageById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT * FROM Custom_package WHERE id = ${id}`)
    .then(([result]) => {
      return (result as CustomPackage[])[0];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

export const packageDetails = async () => {
  const data = await db
    .promise()
    .query(
      `SELECT * FROM Package_detail
        WHERE status = 1`,
    )
    .then(([result]) => {
      return result as PackageDetails[];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};