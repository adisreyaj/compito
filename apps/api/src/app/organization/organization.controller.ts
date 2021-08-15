import { OrganizationRequest, RequestParams, RequestWithUser, UpdateMembersRequest } from '@compito/api-interfaces';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from 'apps/api/src/app/core/config/permissions.config';
import { Permissions } from 'apps/api/src/app/core/decorators/permissions.decorator';
import { PermissionsGuard } from 'apps/api/src/app/core/guards/permissions.guard';
import { Role } from '../core/decorators/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { OrganizationService } from './organization.service';

@Controller('orgs')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('admin')
  @Permissions(PERMISSIONS.org.create)
  @Post()
  create(@Body() organization: OrganizationRequest) {
    return this.organizationService.create(organization);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('admin')
  @Permissions(PERMISSIONS.org.read)
  @Get()
  findAll(@Query() query: RequestParams, @Req() req: RequestWithUser) {
    return this.organizationService.findAll(query, req.user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.read)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.update)
  @Patch(':id/members')
  updateMembers(@Param('id') id: string, @Body() data: UpdateMembersRequest) {
    return this.organizationService.updateMembers(id, data);
  }

  @UseGuards(PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() organization: OrganizationRequest) {
    return this.organizationService.update(id, organization);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
