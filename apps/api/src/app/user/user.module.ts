import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  controllers: [UserController],
})
export class UserModule {}
