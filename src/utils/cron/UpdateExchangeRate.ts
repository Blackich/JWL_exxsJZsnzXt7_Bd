import axios from "axios";
import cron from "node-cron";
import { db } from "@src/main";
import { isNumber } from "@src/utils/utils";
import { logger } from "@src/utils/logger/logger";
import { logErr } from "@src/middleware/errorHandler";
import { getExchangeRate } from "@src/utils/intermediateReq";

const apiKeyExchRate = process.env.API_KEY_EXCH_RATE;

export const updExchangeRate = cron.schedule("0 */2 * * *", async () => {
  try {
    const response = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKeyExchRate}`,
    );
    if (response.status !== 200) return;

    const externalRate = response.data.rates.RUB;
    const databaseRate = await getExchangeRate();
    if (!isNumber(databaseRate)) return;
    if (Number(externalRate) === Number(databaseRate)) return;

    return await updateDatabaseValue(externalRate);
  } catch (err) {
    logger.error("updExchangeRate", { err });
  }
});

//--------------------------------------------------

const updateDatabaseValue = async (exchangeRate: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Exchange_rate
        SET value = ${exchangeRate}
        WHERE typeRate = 'external'`,
    )
    .then(([result]) => result)
    .catch((err) => logErr(err, "updateDatabaseValue"));
};
