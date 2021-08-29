import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompitoLoggerModule } from '../core/utils/logger.service';
import { PrismaModule } from '../prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [PrismaModule, AuthModule, CompitoLoggerModule],
  controllers: [UserController],
})
export class UserModule {}
