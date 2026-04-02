import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Me } from 'src/common/decorators/user.decorator';
import { CreateWhiteListDto } from './dto/create-whitelist-dto';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseInterceptors(LoggerInterceptor)
// @UseGuards(AuthGuard)
@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get()
    @Roles('ADMIN')
    async findAll(@Query('username') username?: string) {
        if (username) {
            const result = await this.userService.findByUsername(username);

            return {
                success: true,
                data: result,
            };
        }
        const result = await this.userService.findAll();

        return {
            success: true,
            data: result,
        };
    }

    // PAKE INI KALO MAU MENGGUNAKAN USER DECORATOR SECARA SPESIFIK
    // @Get('me')
    // getProfile(@Me('username') me:any) {
    //     return me;
    // }

    @Get('me')
    getProfile(@Me('') me: any) {
        return {
            success: true,
            data: me,
        };
    }

    @Get('whitelist')
    @Roles('ADMIN')
    async findAllWhitelist(@Query('nik') nik?: string) {
        if (nik) {
            return await this.userService.findWhitelistByNik(nik);
        }
        const result = await this.userService.findAllWhitelist();
        return {
            success: true,
            data: result,
        };
    }

    @Post('whitelist')
    @Roles('ADMIN')
    async createWhitelist(@Body() dto: CreateWhiteListDto) {
        const result = await this.userService.createWhitelist(dto);
        return {
            success: true,
            data: result,
        };
    }

    @Get(':id')
    @Roles('ADMIN')
    async findbyId(@Param('id') id: number) {
        const result = await this.userService.findById(id);
        return {
            success: true,
            data: result,
        };
    }

    @Post()
    @Roles('ADMIN')
    async create(@Body() dto: CreateUserDto) {
        const result = await this.userService.create(dto);
        return {
            success: true,
            data: result,
        };
    }

    @Delete('/:username')
    @Roles('ADMIN')
    async delete(@Param('username') username: string) {
        const result = await this.userService.delete(username);
        return {
            success: true,
            data: result,
        };
    }

    @Patch('whitelist/:nik')
    @Roles('ADMIN')
    async updateWhitelist(@Param('nik') nik: string) {
        const existing = await this.userService.findWhitelistByNik(nik);

        if (!existing) throw new NotFoundException('whitelist tidak ditemukan');

        const result = await this.userService.updateWhitelist(
            nik,
            existing.rowstatus,
        );
        return {
            success: true,
            data: result,
        };
    }

    @Patch()
    @Roles('ADMIN')
    async updateUser(@Body() body: { oldUsername: string; username: string; role: string }) {
        const { oldUsername, username, role } = body; // Pecah objeknya di sini
        console.log(body)

        const result = await this.userService.updateUser(oldUsername, username, role);
        return {
            success: true,
            data: result,
        };
    }

    @Delete('whitelist/:nik')
    @Roles('ADMIN')     
    async deleteWhitelist(@Param('nik') nik: string) {
        const result = await this.userService.deleteWhitelist(nik);
        return {
            success: true,
            data: result,
        };
    }
}
