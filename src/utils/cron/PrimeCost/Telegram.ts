import axios from "axios";
import { logger } from "@src/utils/logger/logger";
import { TGMessageProps } from "./type";
import { getSiteResNameById } from "@src/utils/intermediateReq";

const token = process.env.TG_BOT_TOKEN_COMMENT;
const chat_id = process.env.TG_CHAT_ID_COMMENT;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTGMessageCostChanges = async ({
  was,
  siteId,
  became,
  tableKey,
  serviceName,
  siteServiceId,
}: TGMessageProps) => {
  try {
    const siteName = await getSiteResNameById(siteId);
    if (typeof siteName !== "string") return;

    const message = `
Изменение стоимости услуги ❗️

<b>${siteName}</b> 🆔 ${siteServiceId} 
Услуга: ${serviceName}

💵 Было: <b>${was} $</b>
💵 Стало: <b>${became} $</b>

Затронута таблица: ${tableKey}`;

    await axios.post(url, {
      chat_id: chat_id,
      parse_mode: "HTML",
      text: message,
    });
  } catch (err) {
    logger.error("sendTGMessageCostChanges", { err });
  }
};
