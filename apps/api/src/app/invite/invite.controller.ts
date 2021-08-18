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

  @Post(':id/accept')
  acceptInvite(@Param('id') id: string, @Req() req: RequestWithUser) {
    const sessionToken = req.headers['x-session-token'] as string;
    let email = null;
    let userId = null;
    if (sessionToken) {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      const token: JwtPayload = verify(sessionToken, secret) as any;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      email = token.email;
      userId = token.userId;
    } else {
      const { userId: userIdVale, email: userEmail } = getUserDetails(req.user);
      email = userEmail;
      userId = userIdVale;
    }
    if (email == null && userId == null) {
      throw new BadRequestException();
    }
    return this.inviteService.accept(id, userId, email);
  }

  @Post(':id/reject')
  rejectInvite(@Param('id') id: string, @Req() req: RequestWithUser) {
    const sessionToken = req.headers['x-session-token'] as string;
    let email = null;
    let userId = null;
    if (sessionToken) {
      const secret = this.config.get('SESSION_TOKEN_SECRET');
      const token: JwtPayload = verify(sessionToken, secret) as any;
      if (!token) {
        throw new ForbiddenException('Session not valid. Please login again!');
      }
      email = token.email;
      userId = token.userId;
    } else {
      const { userId: userIdVale, email: userEmail } = getUserDetails(req.user);
      email = userEmail;
      userId = userIdVale;
    }
    if (email == null && userId == null) {
      throw new BadRequestException();
    }
    return this.inviteService.reject(id, userId, email);
  }
}
