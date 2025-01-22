import { Request, Response } from "express";
import { isString } from "@src/utils/utils";
import { getInstSettings } from "./Entity/queries";
import { logErr, tryCatch } from "@src/middleware/errorHandler";
import { convertToBase64, getInstAccList } from "./Entity/utils";

export const searchSocAccByQueryNick = tryCatch(
  async (req: Request, res: Response) => {
    const { nickname } = req.body;
    if (!isString(nickname) || nickname.length <= 1)
      return res.status(400).json({ message: "Missing required fields" });

    const instSetting = await getInstSettings();
    if (!instSetting)
      return res.status(400).json({ message: "Database error" });

    const instagramResponse = await getInstAccList(
      nickname,
      instSetting.token,
      instSetting.userId,
      instSetting.sessionId,
    ).catch((err) => {
      res.status(400).json({ message: "Instagram is unavailable" });
      logErr(err, "SearchSocialAccount/getInstAcc");
    });
    if (!instagramResponse)
      return res.status(400).json({ message: "Instagram is unavailable" });

    if (instagramResponse.status === "ok") {
      if (instagramResponse.users.length === 0) return res.status(200).json([]);

      const users = await Promise.all(
        instagramResponse.users.map(async (userObj) => {
          const base64Image = await convertToBase64(
            userObj.user.profile_pic_url,
          );

          return {
            id: userObj.user.id,
            username: userObj.user.username,
            profilePicUrl: base64Image ? base64Image : null,
            isPrivate: userObj.user.is_private,
          };
        }),
      );
      return res.status(200).json(users || []);
    }

    return res.status(404).json({ message: "Smth went wrong" });
  },
);
