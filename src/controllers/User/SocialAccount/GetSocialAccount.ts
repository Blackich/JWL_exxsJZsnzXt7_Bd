import { Request, Response } from "express";
import { tryCatch } from "@src/middleware/errorHandler";
import {
  getInstSettings,
  getSocialAccListByUserId,
  updateInstProfileIdByUserId,
} from "./Entity/queries";
import {
  convertToBase64,
  getInstagramUserId,
  getUserProfilePicture,
} from "./Entity/utils";

export const getSocialList = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing required fields" });
  const userList = await getSocialAccListByUserId(Number(id));

  return res.status(200).json(userList);
});

export const getProfilePhotoByUserName = tryCatch(
  async (req: Request, res: Response) => {
    const { username, instProfileId, socAccId } = req.body;
    if (!username)
      return res.status(400).json({ message: "Missing required fields" });

    const instSettings = await getInstSettings();
    if (!instSettings)
      return res.status(400).json({ message: "Database error" });

    if (instProfileId) {
      const imageLink = await getUserProfilePicture(
        instProfileId,
        instSettings.token,
        instSettings.userId,
        instSettings.sessionId,
      ).catch(() => null);
      if (!imageLink) return res.status(200).json(null);

      const imageBase64 = await convertToBase64(imageLink).catch(() => null);
      return res.status(200).json(imageBase64 || null);
    }

    const instProfileIdAsync = await getInstagramUserId(username).catch(
      () => null,
    );
    if (!instProfileIdAsync) return res.status(200).json(null);

    const updateProfile = await updateInstProfileIdByUserId(
      instProfileIdAsync,
      socAccId,
    );
    if (!updateProfile) return res.status(200).json(null);

    return res.status(200).json(null);
  },
);
