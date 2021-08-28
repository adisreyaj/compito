import { Module } from '@nestjs/common';
import { FileStorageModule } from '../core/services/file-storage.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  providers: [AssetsService],
  imports: [FileStorageModule],
  controllers: [AssetsController],
})
export class AssetsModule {}
