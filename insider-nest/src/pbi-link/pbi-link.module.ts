import { Module } from '@nestjs/common';
import { PbiLinkController } from './pbi-link.controller';
import { PbiLinkService } from './pbi-link.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PbiLinkController],
  providers: [PbiLinkService]
})
export class PbiLinkModule {}
