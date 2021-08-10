import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [PrismaModule],
})
export class BoardsModule {}
