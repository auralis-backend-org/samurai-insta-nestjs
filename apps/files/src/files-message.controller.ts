import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FilesMessageController {
  @MessagePattern({ cmd: 'files.ping' })
  ping() {
    return {
      service: 'file-service',
      status: 'ok',
      message: 'Files microservice is working!',
    };
  }
}