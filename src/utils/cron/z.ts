import { expServices } from "./ExpiredServices";
import { updExchangeRate } from "./UpdateExchangeRate";
import { expExtraComments } from "./ExpiredExtraComments";
import { adjustPrimeCost } from "./PrimeCost/AdjustPrimeCost";
import { resendExtServices } from "./ResendExternalServices/AdjustRejectServices";

export function startCronJobs() {
  expServices.start();
  expExtraComments.start();
  adjustPrimeCost.start();
  updExchangeRate.start();
  resendExtServices.start();
}
