import axios from "axios";
import { RespAxiosInstAcc } from "./types";

export const getInstAccList = async (
  queryNickname: string,
  token: string,
  userId: string,
  sessionId: string,
) => {
  const url = `https://www.instagram.com/web/search/topsearch/?query=${queryNickname}`;
  const cookies = `csrftoken=${token}; ds_user_id=${userId}; sessionid=${sessionId};`;
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies,
    },
  });
  return response.data as RespAxiosInstAcc;
};

export const getUserProfilePicture = async (
  instId: string,
  token: string,
  userId: string,
  sessionId: string,
) => {
  const accountInfo = `https://www.instagram.com/graphql/query/?query_hash=c9100bf9110dd6361671f113dd02e7d6&variables={"user_id":${instId},"include_reel":true}`;
  const cookies = `csrftoken=${token}; ds_user_id=${userId}; sessionid=${sessionId};`;
  const response = await axios.get(accountInfo, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies,
    },
  });
  if (!response) return null;
  return response.data.data.user.reel.user.profile_pic_url;
};

export const getInstagramUserId = async (username: string) => {
  try {
    const response = await axios
      .get(`https://www.instagram.com/${username}/`)
      .catch(() => null);
    if (!response) return null;

    const html = response.data;
    const userIdMatch = html?.match(/"profilePage_([0-9]+)"/);
    if (userIdMatch && userIdMatch[1]) {
      return userIdMatch[1];
    } else {
      throw new Error("Не удалось найти userId");
    }
  } catch (error) {
    return null;
  }
};

export const convertToBase64 = async (url: string) => {
  const response = await axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .catch(() => null);

  if (!response) return null;
  const base64Image = `data:image/jpeg;base64,${Buffer.from(
    response.data,
    "binary",
  ).toString("base64")}`;
  return base64Image;
};
