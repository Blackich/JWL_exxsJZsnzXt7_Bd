import { db } from "@src/main";

export const getEmployeeCredentialsByLogin = async (login: string) => {
  return await db
    .promise()
    .query(
      `SELECT id, login, password, role
        FROM Employees WHERE login = '${login}'`,
    )
    .then(([result]) => {
      const adminCred = result as {
        id: number;
        role: string;
        login: string;
        password: string;
      }[];
      return adminCred[0]?.id ? adminCred[0] : null;
    })
    .catch(() => {
      return null;
    });
};
