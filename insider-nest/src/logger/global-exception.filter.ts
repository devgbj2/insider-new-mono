import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Global,
} from '@nestjs/common';
import { LoggerService } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    this.logger.error({
      message: 'Request failed',
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?.id,
      error: exception.message,
      stack: exception.stack,
    });

    res.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}