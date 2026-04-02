import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});