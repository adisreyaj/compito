import { ProjectRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PERMISSIONS } from 'apps/api/src/app/core/config/permissions.config';
import { Permissions } from 'apps/api/src/app/core/decorators/permissions.decorator';
import { PermissionsGuard } from 'apps/api/src/app/core/guards/permissions.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private organizationService: ProjectService) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.create)
  @Post()
  create(@Body() organization: ProjectRequest) {
    return this.organizationService.create(organization);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.read)
  @Get()
  findAll(@Query() query: RequestParamsDto) {
    return this.organizationService.findAll(query);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.read)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() organization: ProjectRequest) {
    return this.organizationService.update(id, organization);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
