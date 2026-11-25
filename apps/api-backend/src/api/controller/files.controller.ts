
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('files')
export class FilesController {
  constructor(
    @Inject('FILE_SERVICE')
    private readonly fileClient: ClientProxy,
  ) {}

  @Get('ping')
  async ping() {
    return firstValueFrom(
      this.fileClient.send(
        { cmd: 'files.ping' },
        {},
      ),
    );
  }
}
