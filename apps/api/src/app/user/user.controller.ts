import { RequestParams, RequestWithUser, UserRequest, UserSignupRequest } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Public } from '../core/decorators/public.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Role('project-admin')
  @Get('')
  findAll(@Query() query: RequestParams & { projectId?: string }, @Req() req: RequestWithUser) {
    return this.userService.findAll(query, req.user);
  }

  // For UI to get onboarding details post login flow
  @Public()
  @Get('pre-auth/onboard')
  getOnboardingDetails(@Req() req: Request) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      throw new ForbiddenException('Not enough permissions');
    }
    return this.userService.getOnboardingDetails(sessionToken);
  }

  // For Auth0 to access during login flow
  @Public()
  @Get('auth')
  getUserDetails(@Req() req: Request) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      throw new ForbiddenException('Not enough permissions');
    }
    return this.userService.getUserDetails(sessionToken);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.read)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.userService.find(id, req.user);
  }

  @Public()
  @Post('signup')
  signup(@Body() user: UserSignupRequest) {
    return this.userService.signup(user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.user.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UserRequest, @Req() req: RequestWithUser) {
    return this.userService.updateUser(id, user, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.user.delete)
  @Role('org-admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.userService.deleteUser(id, req.user);
  }
}
