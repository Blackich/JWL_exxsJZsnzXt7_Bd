import axios from "axios";
import {
  getCustomPackageById,
  getPackageById,
  getSocialNicknameById,
} from "@src/utils/intermediateReq";

const token = process.env.TG_BOT_TOKEN;
const chat_id = process.env.TG_CHAT_ID;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTelegramMessage = async (
  user_id: number,
  soc_nickname_id: number,
  package_id: number,
  custom_package: number,
  count_posts: number,
  cost: number,
  currency: string,
  service: string,
) => {
  const pack =
    Number(custom_package) === 0
      ? await getPackageById(package_id)
      : await getCustomPackageById(package_id);
  const soc = await getSocialNicknameById(soc_nickname_id);
  if (!("likes" in pack) || !("nickname" in soc)) return;

  const message = `Куплен пакет: <b>${pack.likes}</b> ❤️ ${
    Number(custom_package) === 0 ? "" : "(custom)"
  }
    📄 Постов: <b>${count_posts}</b>
    🆔 UserId: <b>${user_id}</b>
    👤 Nickname: <b>${soc.nickname}</b>
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
