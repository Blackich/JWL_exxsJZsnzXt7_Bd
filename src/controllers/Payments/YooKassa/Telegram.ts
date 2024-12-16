import axios from "axios";
import { TGSenderPackInfo } from "./type";
import {
  getCustomPackageById,
  getPackageById,
  getSocialNicknameById,
} from "@src/utils/intermediateReq";
import { logger } from "@src/utils/logger/logger";

const token = process.env.TG_BOT_TOKEN_INFO;
const chat_id = process.env.TG_CHAT_ID_INFO;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTelegramMessagePack = async ({
  userId,
  socialNicknameId,
  packageId,
  customPackage,
  countPosts,
  cost,
  currency,
  paymentServiceName,
}: TGSenderPackInfo) => {
  try {
    const pack =
      Number(customPackage) === 0
        ? await getPackageById(packageId)
        : await getCustomPackageById(packageId);
    const soc = await getSocialNicknameById(socialNicknameId);
    if (!("likes" in pack) || !("nickname" in soc)) return;

    const message = `Куплен пакет: <b>${pack.likes}</b> ❤️ ${
      Number(customPackage) === 0 ? "" : "(custom)"
    }
      📄 Постов: <b>${countPosts}</b>
      🆔 UserId: <b>${userId}</b>
      👤 Nickname: <b>${soc.nickname}</b>
      ${currency === "RUB" ? "🇷🇺" : "💵"} Сумма: <b>${Number(cost).toFixed(
      0,
    )} ${currency}</b>
      🏦 Сервис: <b>${paymentServiceName}</b>`;

    await axios.post(url, {
      chat_id: chat_id,
      parse_mode: "HTML",
      text: message,
    });
  } catch (err) {
    logger.error((err as Error).stack);
  }
};

// export const sendTelegramMessageExtra = async ({
//   userId,
//   socialNicknameId,
//   packageId,
//   customPackage,
//   countPosts,
//   cost,
//   currency,
//   service,
// }: TGSenderExtraInfo) => {
//   const pack =
//     Number(customPackage) === 0
//       ? await getPackageById(packageId)
//       : await getCustomPackageById(packageId);
//   const soc = await getSocialNicknameById(socialNicknameId);
//   if (!("likes" in pack) || !("nickname" in soc)) return;

//   const message = `Куплен пакет: <b>${pack.likes}</b> ❤️ ${
//     Number(customPackage) === 0 ? "" : "(custom)"
//   }
//     📄 Постов: <b>${countPosts}</b>
//     🆔 UserId: <b>${userId}</b>
//     👤 Nickname: <b>${soc.nickname}</b>
//     ${currency === "RUB" ? "🇷🇺" : "💵"} Сумма: <b>${Number(cost).toFixed(
//     0,
//   )} ${currency}</b>
//     🏦 Сервис: <b>${service}</b>`;

//   await axios.post(url, {
//     chat_id: chat_id,
//     parse_mode: "HTML",
//     text: message,
//   });
// };
