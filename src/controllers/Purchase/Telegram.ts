import axios from "axios";
import { db } from "@src/main";
import { isString } from "@src/utils/utils";
import { TGSenderCommentInfo } from "./type";
import { logger } from "@src/utils/logger/logger";
import { logErr } from "@src/middleware/errorHandler";
import {
  getExtraServiceNameByExtraId,
  getSocialNicknameById,
} from "@src/utils/intermediateReq";

const token = process.env.TG_BOT_TOKEN_COMMENT;
const chat_id = process.env.TG_CHAT_ID_COMMENT;
const url = `https://api.telegram.org/bot${token}/sendMessage`;

export const sendTGMessageComment = async ({
  userId,
  extraId,
  countComments,
  extraServiceId,
  socialNicknameId,
}: TGSenderCommentInfo) => {
  try {
    const socNick = await getSocialNicknameById(socialNicknameId);
    const serviceName = await getExtraServiceNameByExtraId(extraServiceId);
    const comments = await getLastCommentsByUserId(userId, socialNicknameId);
    if (!isString(socNick)) return;
    if (!isString(serviceName)) return;

    const commentsColumn =
      extraServiceId === 4 && isString(comments)
        ? comments.split("x1Ejf7\n").join("\n")
        : "";

    const message = `${serviceName} 💬
      🔢 Кол-во: <b>${countComments}</b>
      🆔 UserId: <b>${userId}</b>
      📋 ExtraId: <a href="https://www.gram.top/panel/extra/${extraId}"><b>${extraId}</b></a>
      👤 Nickname: <a href="https://www.instagram.com/${socNick}"><b>${socNick}</b></a>

${commentsColumn}`;

    await axios.post(url, {
      chat_id: chat_id,
      parse_mode: "HTML",
      text: message,
    });
  } catch (err) {
    logger.error("sendTGMessageComment", { err });
  }
};

//--------------------------------------------------

const getLastCommentsByUserId = async (
  userId: number,
  socialNicknameId: number,
) => {
  return await db
    .promise()
    .query(
      `SELECT comments FROM Extra_service_comment
        WHERE userId = ${userId} 
        AND socialNicknameId = ${socialNicknameId}`,
    )
    .then(([result]) => {
      const res = result as { comments: string }[];
      return res[res.length - 1].comments;
    })
    .catch((err) => logErr(err, "getLastCommentsByUserId"));
};
