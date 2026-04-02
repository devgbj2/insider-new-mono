import { Module } from '@nestjs/common';
import { IspController } from './isp.controller';
import { IspService } from './isp.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [IspController],
  providers: [IspService]
})
export class IspModule {}
