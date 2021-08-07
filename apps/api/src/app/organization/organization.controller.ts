import { OrganizationRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}
  @Post()
  create(@Body() organization: OrganizationRequest) {
    return this.organizationService.create(organization);
  }

  @Get()
  findAll(@Query() query: RequestParamsDto) {
    return this.organizationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() organization: OrganizationRequest) {
    return this.organizationService.update(id, organization);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
