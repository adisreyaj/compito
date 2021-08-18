import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [PrismaModule],
})
export class InviteModule {}
