import { db } from "@src/main";
import { logErr } from "@src/middleware/errorHandler";
import {
  CustomPackageDetails,
  PackageDetails,
  SocialNickname,
  PackageSettings,
  ExchangeRate,
} from "./types";

export const getPackageDetailsById = async (id: number) => {
  return await db
    .promise()
    .query(`SELECT * FROM Package_detail WHERE id = ${id}`)
    .then(([result]) => (result as PackageDetails[])[0])
    .catch((err) => logErr(err, "intReq/getPackageDetailsById"));
};

export const getSocialNicknameById = async (id: number) => {
  return await db
    .promise()
    .query(`SELECT * FROM Social_nickname WHERE id = ${id}`)
    .then(([result]) => (result as SocialNickname[])[0]?.nickname)
    .catch((err) => logErr(err, "intReq/getSocialNicknameById"));
};

export const getCustomPackageDetailsById = async (id: number) => {
  return await db
    .promise()
    .query(`SELECT * FROM Custom_package_detail WHERE id = ${id}`)
    .then(([result]) => (result as CustomPackageDetails[])[0])
    .catch((err) => logErr(err, "intReq/getCustomPackageDetailsById"));
};

export const packageSettings = async () => {
  return await db
    .promise()
    .query(
      `SELECT * FROM Package_setting
        WHERE status = 1`,
    )
    .then(([result]) => result as PackageSettings[])
    .catch((err) => logErr(err, "intReq/packageSettings"));
};

export const getExtraServiceNameByExtraId = async (extraServiceId: number) => {
  return await db
    .promise()
    .query(
      `SELECT serviceName FROM Extra_service
        WHERE id = ${extraServiceId}`,
    )
    .then(([result]) => (result as { serviceName: string }[])[0]?.serviceName)
    .catch((err) => logErr(err, "intReq/getExtraServiceNameByExtraId"));
};

export const getExchangeRate = async () => {
  return await db
    .promise()
    .query(
      `SELECT * FROM Exchange_rate
        WHERE typeRate = 'external'`,
    )
    .then(([result]) => Number((result as ExchangeRate[])[0]?.value))
    .catch((err) => logErr(err, "intReq/getExchangeRate"));
};
