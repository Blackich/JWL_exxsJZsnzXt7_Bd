import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    // new transports.File({
    //   filename: "src/utils/logger/error.log",
    //   level: "error",
    // }),
  ],
});
