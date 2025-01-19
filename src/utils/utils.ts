import jwt from "jsonwebtoken";

export const siteJP = "https://justanotherpanel.com/api/v2";
export const siteVenro = "https://venro.ru/api/orders";
export const siteWiq = "https://wiq.ru/api/";

export const accessTokenExpiresIn = "4h";
export const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 day;

export const getTokens = (employeeId: number, login: string, role: string) => ({
  accessToken: jwt.sign(
    { employeeId, login, role },
    process.env.JWT_ADMIN_ACCESS_KEY || "",
    { expiresIn: accessTokenExpiresIn },
  ),
  refreshToken: jwt.sign(
    { employeeId, login, role },
    process.env.JWT_ADMIN_REFRESH_KEY || "",
    { expiresIn: refreshTokenExpiresIn },
  ),
});

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

export const isNumber = (variable: unknown): variable is number => {
  return typeof variable === "number";
};

export const isString = (variable: unknown): variable is string => {
  return typeof variable === "string";
};

export const isArray = (variable: unknown): variable is unknown[] => {
  return Array.isArray(variable) && variable.length > 0;
};

export const isObject = (
  variable: unknown,
): variable is Record<string, unknown> => {
  return (
    typeof variable === "object" &&
    variable !== null &&
    !Array.isArray(variable) &&
    Object.keys(variable).length > 0
  );
};
