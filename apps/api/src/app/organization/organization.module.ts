import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
  imports: [PrismaModule, Logger],
})
export class OrganizationModule {}
