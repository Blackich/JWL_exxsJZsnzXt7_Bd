import axios from "axios";
import cron from "node-cron";
import { db } from "@src/main";
import { logger } from "@src/utils/logger/logger";
import { getExchangeRate } from "@src/utils/intermediateReq";

export const updExchangeRate = cron.schedule("0 */4 * * *", async () => {
  try {
    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/f022fd18e6240e451b1f9fbd/latest/USD",
    );
    if (response.status !== 200) return;

    const externalRate = response.data.conversion_rates.RUB;
    const databaseRate = await getExchangeRate();
    if (Number(externalRate) === Number(databaseRate)) return;

    return await updateDatabaseValue(externalRate);
  } catch (err) {
    logger.error((err as Error).stack);
  }
});

//--------------------------------------------------

const updateDatabaseValue = async (exchange: number) => {
  return await db
    .promise()
    .query(
      `UPDATE Exchange_rate
        SET value = ${exchange}
        WHERE typeRate = 'external'`,
    )
    .then(([result]) => {
      return result;
    })
    .catch((err) => logger.error(err.stack));
};
