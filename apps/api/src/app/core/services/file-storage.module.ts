import { Module } from '@nestjs/common';
import { CompitoLoggerModule } from '../utils/logger.service';
import { FileStorageService } from './file-storage.service';
@Module({
  imports: [CompitoLoggerModule],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
