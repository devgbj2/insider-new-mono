import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { LogService } from './log.service';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtGuard)
@Controller('log')
export class LogController {
    constructor(private logsService: LogService) { }

    @Get()
    async findAll(@Query() query: QueryActivityLogDto) {
        return this.logsService.findAll(query);
    }

}
