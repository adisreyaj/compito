import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService],
})
export class OrganizationModule {}
