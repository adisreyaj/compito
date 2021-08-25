import { RequestWithUser } from '@compito/api-interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Public } from '../core/decorators/public.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { JoiValidationPipe } from '../core/pipes/validation/validation.pipe';
import { getUserDetails } from '../core/utils/payload.util';
import { InviteService } from './invite.service';
import { createInviteValidationSchema } from './invite.validation';
@Controller('invites')
export class InviteController {
  constructor(private inviteService: InviteService, private config: ConfigService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.user.create)
  @Post('')
  @UsePipes(new JoiValidationPipe(createInviteValidationSchema))
  invite(@Body() data: { email: string; role: string }, @Req() req: RequestWithUser) {
    return this.inviteService.invite(data, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.user.create)
  @Get('')
  getInvites(@Req() req: RequestWithUser) {
    return this.inviteService.getInvites(req.user);
  }

  @Public()
  @Post('/pre-auth/:id/accept')
  acceptInvitePreAuth(@Param('id') id: string, @Req() req: RequestWithUser) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (sessionToken) {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      const token: JwtPayload = verify(sessionToken, secret) as any;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const email = token.email;
      const userId = token.userId;
      return this.inviteService.accept(id, userId, email);
    } else {
      throw new ForbiddenException('Session not valid. Please login again!');
    }
  }
  @Post(':id/accept')
  acceptInvite(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId, email } = getUserDetails(req.user);
    if (email == null && userId == null) {
      throw new BadRequestException();
    }
    return this.inviteService.accept(id, userId, email);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.user.create)
  @Post(':id/cancel')
  cancelInvite(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.inviteService.cancel(id, req.user);
  }

  @Public()
  @Post('/pre-auth/:id/reject')
  rejectInvitePreAuth(@Param('id') id: string, @Req() req: RequestWithUser) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (sessionToken) {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      const token: JwtPayload = verify(sessionToken, secret) as any;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      const email = token.email;
      const userId = token.userId;
      return this.inviteService.reject(id, userId, email);
    } else {
      throw new ForbiddenException('Session not valid. Please login again!');
    }
  }

  @Post(':id/reject')
  rejectInvite(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId, email } = getUserDetails(req.user);
    if (email == null && userId == null) {
      throw new BadRequestException();
    }
    return this.inviteService.reject(id, userId, email);
  }
}
