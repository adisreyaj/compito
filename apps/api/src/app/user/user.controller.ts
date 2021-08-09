import { RequestParamsDto, UserRequest } from '@compito/api-interfaces';
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
  @Post()
  create(@Body() user: UserRequest) {
    return this.userService.create(user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get()
  findAll(@Query() query: RequestParamsDto) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get(':id')
  findOne(@Param('id') id: string) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UserRequest) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {}
}
