import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LogModule } from 'src/log/log.module';

@Global()
@Module({
    imports: [LogModule],
    providers: [LoggerService],
    exports: [ LoggerService]
})
export class LoggerModule { }