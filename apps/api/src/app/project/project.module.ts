import { Module } from '@nestjs/common';
import { CompitoLoggerModule } from '../core/utils/logger.service';
import { PrismaModule } from '../prisma.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
  imports: [PrismaModule, CompitoLoggerModule],
})
export class ProjectModule {}
