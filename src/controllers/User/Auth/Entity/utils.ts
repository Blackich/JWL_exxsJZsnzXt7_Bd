import jwt from "jsonwebtoken";

export const accessTokenExpiresIn = "15s";
export const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 day;

export const getTokens = (id: number, email: string) => ({
  accessToken: jwt.sign(
    { id, email },
    process.env.JWT_USER_ACCESS_KEY as string,
    { expiresIn: accessTokenExpiresIn },
  ),
  refreshToken: jwt.sign(
    { id, email },
    process.env.JWT_USER_REFRESH_KEY as string,
    { expiresIn: refreshTokenExpiresIn },
  ),
});

export const preValidationUserData = (email: string, password: string) => {
  if (!email || typeof email !== "string") return false;
  if (!password || typeof password !== "string") return false;
  return true;
};

export const getUnixTime = () => Math.round(+new Date() / 1000);
