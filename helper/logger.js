const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const logger = winston.createLogger({
  defaultMeta: {
    service: "admin-service",
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    winston.format.ms(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/application.log" }),
    new DailyRotateFile({
      dirname: "logs/backup",
      filename: "logs/backup/app-%DATE%.log",
      // archive file-file lama, agar tidak terlalu besar ukurannya
      zippedArchive: true,
      // max file size 1MB
      maxSize: "1m",
      // berapa lama file akan disimpan "7 day"
      maxFiles: "7d",
    }),
    new winston.transports.File({
      level: "error",
      filename: "logs/application-error.log",
    }),
  ],
});
module.exports = logger;
