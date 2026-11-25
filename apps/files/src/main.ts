import { NestFactory } from '@nestjs/core';
import { FilesModule } from './files.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const port = Number(process.env.PORT) || 4486;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port
      },
    },
  );

  await app.listen();

  console.log(
    `Files microservice is running on port ${process.env.PORT || 4486}`,
  );
  console.log(`SERVICE: ${process.env.SERVICE}`);
}

void bootstrap();
