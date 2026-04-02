import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt/jwt.guard';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET    
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, RolesGuard, UserService],
  exports: [AuthService, JwtModule, JwtGuard, RolesGuard],
})
export class AuthModule { }
