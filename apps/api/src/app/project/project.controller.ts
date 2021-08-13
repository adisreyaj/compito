import {
  ProjectRequest,
  RequestParamsDto,
  RequestWithUser,
  UpdateProjectMembersRequest,
} from '@compito/api-interfaces';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from 'apps/api/src/app/core/config/permissions.config';
import { Permissions } from 'apps/api/src/app/core/decorators/permissions.decorator';
import { PermissionsGuard } from 'apps/api/src/app/core/guards/permissions.guard';
import { Role } from '../core/decorators/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.project.create)
  @Post()
  create(@Body() project: ProjectRequest, @Req() req: RequestWithUser) {
    return this.projectService.create(project, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.project.read)
  @Get()
  findAll(@Query() query: RequestParamsDto) {
    return this.projectService.findAll(query);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.project.read)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.project.update)
  @Patch(':id/members')
  updateMembers(@Param('id') id: string, @Body() data: UpdateProjectMembersRequest) {
    return this.projectService.updateMembers(id, data);
  }
  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.project.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() project: ProjectRequest) {
    return this.projectService.update(id, project);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.project.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
