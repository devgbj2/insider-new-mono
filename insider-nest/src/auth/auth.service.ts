import { Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) { }


    async login(loginDto: LoginDto) {
        const { username, password, rememberMe } = loginDto;
        const user = await this.userService.findByUsername(username);

        // 1. Cek apakah user ada
        if (!user) {
            throw new UnauthorizedException('user tidak ditemukan');
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw new UnauthorizedException('password salah')
        }


        // 3. Jika benar, buat payload
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email ?? '',
            nik: user.nik ?? '',
        };

        const token = this.jwtService.sign(payload, {
            expiresIn: (rememberMe ? process.env.JWT_EXPIRES_REMEMBER : process.env.JWT_EXPIRES) as any
        })

        return { token };
    }


    async validateLdap(loginDto: LoginDto) {
        const { username, password, rememberMe } = loginDto
        try {
            // 1. Ambil access token
            const tokenUrl = String(process.env.TELKOM_TOKEN_URL);
            const validateUrl = String(process.env.TELKOM_VALIDATE_URL);

            const tokenResponse = await axios.post(tokenUrl, {
                grant_type: 'client_credentials',
                client_id: process.env.TELKOM_CLIENT_ID,
                client_secret: process.env.TELKOM_CLIENT_SECRET,
            });

            const accessToken = tokenResponse?.data?.access_token;

            if (!accessToken) {
                throw new UnauthorizedException('access token gagal didapatkan');
            }

            // 2. Validasi user ke LDAP
            const response = await axios.post(
                validateUrl,
                {
                    username,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            // 3. Interpret response
            if (
                response.data &&
                (response.data.status === 'success' ||
                    response.data.login === 1)
            ) {
                const payload = {
                    id: '',
                    username: username,
                    role: '',
                    email: '',
                    nik: '',
                };

                const token = this.jwtService.sign(payload, {
                    expiresIn: (rememberMe ? process.env.JWT_EXPIRES_REMEMBER : process.env.JWT_EXPIRES) as any
                })

                return { token }
            }
            throw new UnauthorizedException('login ldap gagal');

        } catch (error) {
            console.error(error);
            // kalau memang dari logic kita (invalid login)
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new Error('servis ldap tidak bekerja');
        }
    }
}
