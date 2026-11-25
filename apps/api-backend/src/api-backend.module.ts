
import { AuthController } from './api/controller/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TestController } from './api/controller/test.controller';
import { DatabaseController } from './api/controller/database.controller';
import { FilesController } from './api/controller/files.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: (process.env.AUTH_SERVICE_HOST || '127.0.0.1').trim(),
          port: Number(process.env.AUTH_SERVICE_PORT || '4467'),
        },
      },
      {
        name: 'FILE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: (process.env.FILE_SERVICE_HOST || '127.0.0.1').trim(),
          port: Number(process.env.FILE_SERVICE_PORT || '4486'),
        },
      },
    ]),
  ],
  controllers: [
    AuthController,
    FilesController,
    DatabaseController,
    TestController,
  ],
})
export class ApiBackendModule {}
