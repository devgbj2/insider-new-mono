import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { PbiLinkService } from './pbi-link.service';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@UseInterceptors(LoggerInterceptor)
// @UseGuards(AuthGuard)
@UseGuards(JwtGuard)
@Controller('pbi-link')
export class PbiLinkController {

    constructor(private pbiLinkService: PbiLinkService) { }

    @Get()
    async findAll(@Query('name') name?: string) {

        if (name) {
            const result = await this.pbiLinkService.findByName(name);

            return {
                success: true,
                data: result,
            };
        }
        const result = await this.pbiLinkService.findAll();

        return {
            success: true,
            data: result
        }
    }
}
