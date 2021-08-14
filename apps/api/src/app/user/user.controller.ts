import { RequestParams, RequestWithUser, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.create)
  @Role('org-admin')
  @Post('')
  create(@Body() user: UserRequest) {
    return this.userService.create(user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Role('project-admin')
  @Get('')
  findAll(@Query() query: RequestParams & { projectId?: string }, @Req() req: RequestWithUser) {
    return this.userService.findAll(query, req.user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get(':id')
  findOne(@Param('id') id: string) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.create)
  @Role('org-admin')
  @Post('signup')
  signup(@Body() user: UserSignupRequest) {
    return this.userService.signup(user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UserRequest) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {}
}
