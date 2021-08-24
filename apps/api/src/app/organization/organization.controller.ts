import { OrganizationRequest, RequestParams, RequestWithUser, UpdateMembersRequest } from '@compito/api-interfaces';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { JoiValidationPipe } from '../core/pipes/validation/validation.pipe';
import { OrganizationService } from './organization.service';
import {
  createOrgValidationSchema,
  updateMembersValidationSchema,
  updateOrgValidationSchema,
} from './organization.validation';

@Controller('orgs')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('admin')
  @Permissions(PERMISSIONS.org.create)
  @Post()
  @UsePipes(new JoiValidationPipe(createOrgValidationSchema))
  create(@Body() organization: OrganizationRequest, @Req() req: RequestWithUser) {
    return this.organizationService.create(organization, req.user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.read)
  @Get()
  findAll(@Query() query: RequestParams, @Req() req: RequestWithUser) {
    return this.organizationService.findAll(query, req.user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.read)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.organizationService.findOne(id, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.update)
  @Patch(':id/members')
  @UsePipes(new JoiValidationPipe(updateMembersValidationSchema))
  updateMembers(@Param('id') id: string, @Body() data: UpdateMembersRequest, @Req() req: RequestWithUser) {
    return this.organizationService.updateMembers(id, data, req.user);
  }

  @UseGuards(PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.update)
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(updateOrgValidationSchema))
  update(@Param('id') id: string, @Body() organization: OrganizationRequest, @Req() req: RequestWithUser) {
    return this.organizationService.update(id, organization, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('super-admin')
  @Permissions(PERMISSIONS.org.delete)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.organizationService.remove(id, req.user);
  }
}
