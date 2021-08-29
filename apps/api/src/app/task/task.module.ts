import { Module } from '@nestjs/common';
import { FileStorageModule } from '../core/services/file-storage.module';
import { CompitoLoggerModule } from '../core/utils/logger.service';
import { PrismaModule } from '../prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [PrismaModule, FileStorageModule, CompitoLoggerModule],
  exports: [TaskService],
})
export class TaskModule {}
