import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    //THIS NOT USING DTO
    // @Post()
    // login(@Body() body: { username: string, password: string }) {
    //     const { username, password } = body
    //     return await this.authService.login(username, password)
    // }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        const { username, password, rememberMe } = loginDto

        const isNik = /^\d{6,8}$/.test(username);

        if (isNik) {
            try {
                // coba LDAP dulu
                const { token } = await this.authService.validateLdap(loginDto);

                return {
                    success: true,
                    data: { access_token: token },
                };
            } catch (error) {
                // kalau credential salah → jangan fallback
                if (error instanceof UnauthorizedException) {
                    throw error;
                }
                // kalau error lain (misal LDAP down) → fallback ke DB
                console.error('ldap gagal, mencoba fallback');
            }
        }

        const { token } = await this.authService.login(loginDto)
        return {
            success: true,
            data: {
                access_token: token,
            }
        }
    }

    @Post('/signin')
    async signin(@Body() dto: CreateUserDto) {
        const result = await this.userService.create(dto)
        return {
            success: true,
            data: result
        }
    }
}   
