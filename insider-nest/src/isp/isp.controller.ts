import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { CreateIspDto } from './dto/create-isp-dto';
import { IspService } from './isp.service';
import { QueryIspDto } from './dto/query-isp.dto';


@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtGuard)
@Controller('isp')
export class IspController {

    constructor(private ispService: IspService) { }
    @Get()
    async findAll(@Query() query: QueryIspDto) {
        return this.ispService.findAll(query);
    }

    @Get(':id')
    async findbyId(@Param('id') id: number) {
        const result = await this.ispService.findById(id);
        return {
            success: true,
            data: result
        }
    }

    @Post()
    async create(@Body() dto: CreateIspDto) {
        const result = await this.ispService.create(dto);
        return {
            success: true,
            data: result
        }
    }
}
