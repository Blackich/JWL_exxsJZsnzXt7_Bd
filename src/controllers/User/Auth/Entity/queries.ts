import axios from "axios";
import { db } from "@src/main";
import { ResultSetHeader } from "mysql2";
import { logger } from "@src/utils/logger/logger";

export const getUserCredentialsById = async (id: number) => {
  return await db
    .promise()
    .query(
      `SELECT id, email
        FROM Users WHERE id = '${id}'`,
    )
    .then(([result]) => {
      const userCred = result as {
        id: number;
        email: string;
      }[];
      return userCred[0]?.id ? userCred[0] : null;
    })
    .catch(() => {
      return null;
    });
};

export const getUserCredentialsByEmail = async (email: string) => {
  return await db
    .promise()
    .query(
      `SELECT id, email
        FROM Users WHERE email = '${email}'`,
    )
    .then(([result]) => {
      const userCred = result as {
        id: number;
        email: string;
      }[];
      return userCred[0]?.id ? userCred[0] : null;
    })
    .catch(() => {
      return null;
    });
};

export const getFullUserCredentialsByEmail = async (email: string) => {
  return await db
    .promise()
    .query(
      `SELECT id, email, password
        FROM Users WHERE email = '${email}'`,
    )
    .then(([result]) => {
      const userCred = result as {
        id: number;
        email: string;
        password: string;
      }[];
      return userCred[0]?.id ? userCred[0] : null;
    })
    .catch(() => {
      return null;
    });
};

export const addNewUser = async (email: string, hash: string) => {
  return await db
    .promise()
    .query(
      `INSERT INTO Users (email, password)
        VALUES ('${email}', '${hash}')`,
    )
    .then(([result]) => {
      const insertId = (result as ResultSetHeader)?.insertId;
      return insertId ? insertId : null;
    })
    .catch((err) => {
      logger.error(err);
      return null;
    });
};

export const checkUserEmail = async (email: string) => {
  return await db
    .promise()
    .query(`SELECT id FROM Users WHERE email = '${email}'`)
    .then(([result]) => ((result as { id: number }[])[0]?.id ? true : false))
    .catch(() => {
      return null;
    });
};

export const insertRequestResetPassByUserId = async (userId: number) => {
  return await db
    .promise()
    .query(`INSERT INTO Reset_password (userId) VALUES (${userId})`)
    .then(([result]) => result)
    .catch(() => {
      return null;
    });
};

export const checkTimeForResetPass = async (userId: number) => {
  return await db
    .promise()
    .query(
      `SELECT id FROM Reset_password
        WHERE userId = 35247 
        AND DATE_ADD(createdAt, INTERVAL 30 MINUTE) > NOW()
        ORDER BY createdAt DESC 
        LIMIT 1`,
    )
    .then(([result]) => (result as { id: number }[])[0]?.id)
    .catch(() => {
      return null;
    });
};

export const updateUserPassword = async (userId: number, hash: string) => {
  return await db
    .promise()
    .query(`UPDATE Users SET password = '${hash}' WHERE id = ${userId}`)
    .then(([result]) => {
      const affectedRows = (result as ResultSetHeader)?.affectedRows;
      return affectedRows ? affectedRows : null;
    })
    .catch(() => {
      return null;
    });
};

export const updateStatusPassChangeByUserId = async (userId: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Reset_password
        SET status = 1
        WHERE userId = ${userId}
        ORDER BY createdAt DESC 
        LIMIT 1`,
    )
    .then(([result]) => result)
    .catch(() => {
      return null;
    });
};

export const checkRecaptchaToken = async (reCaptchaToken: string) => {
  const response = await axios.get(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: reCaptchaToken,
      },
    },
  );
  return response.data as {
    success: boolean;
    challenge_ts: string;
    hostname: string;
  };
};
