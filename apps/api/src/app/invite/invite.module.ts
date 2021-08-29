import { Module } from '@nestjs/common';
import { CompitoLoggerModule } from '../core/utils/logger.service';
import { PrismaModule } from '../prisma.module';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [PrismaModule, CompitoLoggerModule],
})
export class InviteModule {}
