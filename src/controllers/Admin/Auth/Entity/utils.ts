import { isString } from "@src/utils/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const accessTokenExpiresIn = 60 * 60 * 4; // 4 hours
export const refreshTokenExpiresIn = 60 * 60 * 24 * 30; // 30 day;

export const getAdminTokens = (
  employeeId: number,
  login: string,
  role: string,
) => ({
  accessToken: jwt.sign(
    { employeeId, login, role },
    process.env.JWT_ADMIN_ACCESS_KEY as string,
    { expiresIn: accessTokenExpiresIn },
  ),
  refreshToken: jwt.sign(
    { employeeId, login, role },
    process.env.JWT_ADMIN_REFRESH_KEY as string,
    { expiresIn: refreshTokenExpiresIn },
  ),
});

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    return null;
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
};

export const preValidationAdminData = (login: string, pass: string) => {
  if (!login || !isString(login) || login.includes(" ")) return false;
  if (login.length > 200 || login.length < 4) return false;

  if (!pass || !isString(pass) || pass.includes(" ")) return false;
  if (pass.length < 5 || pass.length > 30) return false;

  return true;
};

export const getUnixTime = () => Math.round(+new Date() / 1000);
