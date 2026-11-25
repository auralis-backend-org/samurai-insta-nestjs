  import { NestFactory } from '@nestjs/core';
  import { ValidationPipe } from '@nestjs/common';
  import { ApiBackendModule } from './api-backend.module';
  import { setupSwagger } from './config/swagger.config';
  import cookieParser from 'cookie-parser';

  async function bootstrap() {
    const app = await NestFactory.create(ApiBackendModule);

    const allowedOrigins = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');
    setupSwagger(app);

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, '0.0.0.0');

    console.log(`API Backend is running on PORT: ${port}`);
    console.log(`SERVICE: ${process.env.SERVICE}`);
    console.log(`TEST_ENV: ${process.env.TEST_ENV}`);
    console.log(`AUTH_SERVICE_HOST: ${process.env.AUTH_SERVICE_HOST}`);
    console.log(`AUTH_SERVICE_PORT: ${process.env.AUTH_SERVICE_PORT}`);
    console.log(`AUTH_SERVICE_HOST: ${process.env.FILE_SERVICE_HOST}`);
    console.log(`AUTH_SERVICE_PORT: ${process.env.FILE_SERVICE_PORT}`);
    console.log(`FILE_SERVICE_PORT: ${process.env.CORS_ORIGINS}`);
    console.log(`FILE_SERVICE_PORT: ${process.env.RECAPTCHA_SITE_KEY}`);
  }

  void bootstrap();
