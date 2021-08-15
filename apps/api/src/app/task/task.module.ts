import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [PrismaModule],
})
export class TaskModule {}
