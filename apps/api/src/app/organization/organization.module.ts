import { Module } from '@nestjs/common';
import { AuthModule } from 'apps/api/src/app/auth/auth.module';
import { PrismaModule } from '../prisma.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
  imports: [PrismaModule, AuthModule],
})
export class OrganizationModule {}
