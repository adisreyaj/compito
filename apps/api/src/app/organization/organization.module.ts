import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
