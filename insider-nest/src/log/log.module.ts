import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [LogService ],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}