import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from './logger/logger.interceptor';
import { GlobalExceptionFilter } from './logger/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(app.get(LoggerInterceptor));
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted:true
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:5174',

    ], methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Izinkan kirim cookie/header authorization
  });

  // await app.listen(process.env.PORT ?? 8080, '0.0.0.0'),
  await app.listen(process.env.PORT ?? 8080),
    console.log(`Server running on port ${process.env.PORT ?? 8080}`);
}
bootstrap();
