import { RequestWithUser } from '@compito/api-interfaces';
import { BadRequestException, Body, Controller, ForbiddenException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { getUserDetails } from '../core/utils/payload.util';
import { InviteService } from './invite.service';

@Controller('invites')
export class InviteController {
  constructor(private inviteService: InviteService, private config: ConfigService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('org-admin')
  @Permissions(PERMISSIONS.user.create)
  @Post('')
  invite(@Body() data: { email: string; role: string }, @Req() req: RequestWithUser) {
    return this.inviteService.invite(data, req.user);
  }

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
