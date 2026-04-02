import { Injectable } from '@nestjs/common';
import { winstonLogger } from './logger.config';
import { LogService } from '../log/log.service';

@Injectable()
export class LoggerService {
  constructor(private logService: LogService) {}

  async log(data: any) {
    winstonLogger.info(data);

    // simpan log ke DB
    await this.logService.saveLog({
      level: 'info',
      message: data.message,
      ip: data.ip,
      userId: data.userId,
      meta: data,
    }).catch(() => {});
  }

  async error(data: any) {
    winstonLogger.error(data);

    // simpan error ke DB
    await this.logService.saveLog({
      level: 'error',
      message: data.message,
      details: data.error,
      ip: data.ip,
      userId: data.userId,
      meta: data,
    }).catch(() => {});
  }

  warn(data: any) {
    winstonLogger.warn(data);
  }

  debug(data: any) {
    winstonLogger.debug(data);
  }
}