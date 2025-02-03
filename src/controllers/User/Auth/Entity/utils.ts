import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const accessTokenExpiresIn = 60 * 60 * 3; // 3 hours
export const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 day;
export const resetPassTokenExpiresIn = 60 * 15; // 15 minutes;

export const getUserTokens = (id: number, email: string) => ({
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
  resetPassToken: jwt.sign({ id }, process.env.JWT_USER_PASS_RESET as string, {
    expiresIn: resetPassTokenExpiresIn,
    noTimestamp: true,
  }),
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

export const preValidationUserData = (email: string, pass: string) => {
  if (!email || typeof email !== "string" || email.includes(" ")) return false;
  if (!validateEmail(email)) return false;
  if (email.length > 200) return false;

  if (!pass || typeof pass !== "string" || pass.includes(" ")) return false;
  if (pass.length < 5 || pass.length > 30) return false;

  return true;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/gi;
  return emailRegex.test(email);
};

export const getUnixTime = () => Math.round(+new Date() / 1000);
