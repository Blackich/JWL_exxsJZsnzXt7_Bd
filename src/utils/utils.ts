import jwt from "jsonwebtoken";

export const siteJP = "https://justanotherpanel.com/api/v2";
export const siteVenro = "https://venro.ru/api/orders";

export const accessTokenExpiresIn = "4h";
export const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 day;

export const getTokens = (login: string, role: string) => ({
  accessToken: jwt.sign(
    { login, role },
    process.env.JWT_SECRET_ACCESS_KEY || "",
    { expiresIn: accessTokenExpiresIn },
  ),
  refreshToken: jwt.sign(
    { login, role },
    process.env.JWT_SECRET_REFRESH_KEY || "",
    { expiresIn: refreshTokenExpiresIn },
  ),
});

export const fastRandString = (n: number) => {
  return [...Array(n)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join("");
};

export const formatDatePlus30Days = () => {
  const date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // +30 days
  return Intl.DateTimeFormat("en-GB", {
    // format dd/mm/YYYY
  }).format(date);
};

export const getRandomPercentage = (
  num: number,
  minPercent: number,
  maxPercent: number,
) => {
  const min = num * minPercent;
  const max = num * maxPercent;
  return Math.round(Math.random() * (max - min) + min);
};
