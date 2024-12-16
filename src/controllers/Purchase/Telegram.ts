import axios from "axios";
import {
  getCustomPackageById,
  getPackageById,
  getSocialNicknameById,
} from "@src/utils/intermediateReq";
import { logger } from "@src/utils/logger/logger";
import { TGSenderCommentInfo } from "./type";

const token = process.env.TG_BOT_TOKEN_COMMENT;
const chat_id = process.env.TG_CHAT_ID_COMMENT;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTGMessageComment = async ({message}: TGSenderCommentInfo) => {
  try {
    // const message = `Куплен пакет: <b></b> ❤️ ${
    //   Number() === 0 ? "" : "(custom)"
    // }
    //   📄 Постов: <b>${countPosts}</b>
    //   🆔 UserId: <b>${userId}</b>
    //   👤 Nickname: <b>${soc.nickname}</b>
    //   ${currency === "RUB" ? "🇷🇺" : "💵"} Сумма: <b>${Number(cost).toFixed(
    //   0,
    // )} ${currency}</b>
    //   🏦 Сервис: <b>${service}</b>`;
    await axios.post(url, {
      chat_id: chat_id,
      parse_mode: "HTML",
      text: message,
    });
  } catch (err) {
    logger.error((err as Error).stack);
  }
};
