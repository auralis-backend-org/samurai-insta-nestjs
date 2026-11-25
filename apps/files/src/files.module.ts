import { Module } from '@nestjs/common';
import { FilesMessageController } from './files-message.controller';

@Module({
  imports: [],
  controllers: [FilesMessageController],
  providers: [],
})
export class FilesModule {}
