import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompitoLoggerModule } from '../core/utils/logger.service';
import { PrismaModule } from '../prisma.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
  imports: [PrismaModule, AuthModule, CompitoLoggerModule],
})
export class OrganizationModule {}
