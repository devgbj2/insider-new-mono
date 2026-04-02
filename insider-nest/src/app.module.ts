import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DatabaseModule } from './database/database.module';
import { IspModule } from './isp/isp.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { LogModule } from './log/log.module';
import { GlobalExceptionFilter } from './logger/global-exception.filter';
import { PbiLinkModule } from './pbi-link/pbi-link.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    UserModule,
    LoggerModule,
    AuthModule,
    PrismaModule,
    DatabaseModule,
    IspModule,
    ActivityLogsModule,
    LogModule,
    PbiLinkModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'insider-fe', 'dist'),
      exclude: ['/api/{*path}'],  // ✅ format baru
    }),

  ],
  controllers: [AppController, AuthController],
  providers: [AppService, GlobalExceptionFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users')
  }
}
