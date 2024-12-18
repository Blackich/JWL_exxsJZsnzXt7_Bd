import axios from "axios";
import { logger } from "@src/utils/logger/logger";
import { TGSenderExtraInfo, TGSenderPackInfo } from "./type";
import {
  getCustomPackageById,
  getExtraServiceNameByExtraId,
  getPackageById,
  getSocialNicknameById,
} from "@src/utils/intermediateReq";

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

export const sendTelegramMessageExtra = async ({
  cost,
  count,
  userId,
  extraId,
  extraServiceId,
  socialNicknameId,
  paymentServiceName,
}: TGSenderExtraInfo) => {
  const soc = await getSocialNicknameById(socialNicknameId);
  const serviceName = await getExtraServiceNameByExtraId(extraServiceId);

  if (!("nickname" in soc)) return;

  const message = `Куплены: <b>${serviceName}</b> 🤑
    🔢 Кол-во: <b>${count}</b>
    🆔 UserId: <b>${userId}</b>
    👤 Nickname: <b>${soc.nickname}</b>
    📋 ExtraId: <a href="https://www.gram.top/panel/extra/${extraId}"><b>${extraId}</b></a>
    🇷🇺 Сумма: <b>${Number(cost).toFixed(0)} RUB</b>
    🏦 Сервис: <b>${paymentServiceName}</b>`;

  await axios.post(url, {
    chat_id: chat_id,
    parse_mode: "HTML",
    text: message,
  });
};
