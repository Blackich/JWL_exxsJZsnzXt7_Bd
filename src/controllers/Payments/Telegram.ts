import axios from "axios";
import { db } from "@src/main";
import { RowDataPacket } from "mysql2";
import { logger } from "@src/utils/logger/logger";

const token = process.env.TG_BOT_TOKEN;
const chat_id = process.env.TG_CHAT_ID;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTelegramMessage = async (
  user_id: number,
  soc_nickname_id: number,
  package_id: number,
  count_posts: number,
  cost: number,
  currency: string,
  service: string,
) => {
  const pack = await getPackageById(package_id);
  const nickname = await getSocialNicknameById(soc_nickname_id);
  const message = `Куплен пакет: <b>${pack}</b> ❤️
  📄 Постов: <b>${count_posts}</b>
  🆔 UserId: <b>${user_id}</b>
  👤 Nickname: <b>${nickname}</b>
  ${currency === "RUB" ? "🇷🇺" : "💵"} Сумма: <b>${Number(cost).toFixed(
    0,
  )} ${currency}</b>
  🏦 Сервис: <b>${service}</b>`;
  await axios.post(url, {
    chat_id: chat_id,
    parse_mode: "HTML",
    text: message,
  });
};

const getPackageById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT likes FROM Package WHERE id = ${id}`)
    .then(([result]) => {
      return (result as RowDataPacket[])[0].likes;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};

const getSocialNicknameById = async (id: number) => {
  const data = await db
    .promise()
    .query(`SELECT nickname FROM Social_nickname WHERE id = ${id}`)
    .then(([result]) => {
      return (result as RowDataPacket[])[0].nickname;
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
