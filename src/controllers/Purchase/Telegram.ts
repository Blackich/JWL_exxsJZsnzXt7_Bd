import axios from "axios";
import { db } from "@src/main";
import { logger } from "@src/utils/logger/logger";
import { TGSenderCommentInfo } from "./type";
import { getSocialNicknameById } from "@src/utils/intermediateReq";

const token = process.env.TG_BOT_TOKEN_COMMENT;
const chat_id = process.env.TG_CHAT_ID_COMMENT;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTGMessageComment = async ({
  userId,
  extraId,
  countComments,
  extraServiceId,
  socialNicknameId,
  commentServiceName,
}: TGSenderCommentInfo) => {
  try {
    const soc = await getSocialNicknameById(socialNicknameId);
    const { comments } = (await getLastCommentsByUserId(
      userId,
      socialNicknameId,
    )) as { comments: string };
    if (!("nickname" in soc)) return;

    const message = `${commentServiceName} 💬
      🔢 Кол-во: <b>${countComments}</b>
      🆔 UserId: <b>${userId}</b>
      📑 ExtraId: <a href="https://www.gram.top/panel/extra/${extraId}"><b>${extraId}</b></a>
      👤 Nickname: <a href="https://www.instagram.com/${soc.nickname}"><b>${
      soc.nickname
    }</b></a>

${extraServiceId === 4 && comments ? comments.split(",").join("\n") : ""}`;

    await axios.post(url, {
      chat_id: chat_id,
      parse_mode: "HTML",
      text: message,
    });
  } catch (err) {
    logger.error((err as Error).stack);
  }
};

//--------------------------------------------------

export const getLastCommentsByUserId = async (
  userId: number,
  socialNicknameId: number,
) => {
  const data = await db
    .promise()
    .query(
      `SELECT comments FROM Extra_service_comment
        WHERE userId = ${userId} 
        AND socialNicknameId = ${socialNicknameId}`,
    )
    .then(([result]) => {
      const res = result as { comments: string }[];
      return res[res.length - 1];
    })
    .catch((err) => logger.error(err.stack));
  return data;
};
