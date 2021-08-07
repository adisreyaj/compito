import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
  imports: [PrismaModule],
})
export class ProjectModule {}
