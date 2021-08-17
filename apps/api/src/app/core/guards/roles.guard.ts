import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../config/roles.config';
import { isOperationAllowed } from '../utils/roles-permission.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requireRole = this.reflector.get<Roles>('role', context.getHandler());

    const userRole = context.getArgs()[0].user['https://compito.adi.so/role'] ?? null;
    if (!requireRole) {
      return true;
    }
    const hasAuthority = () => isOperationAllowed(requireRole, userRole);
    if (hasAuthority()) {
      return true;
    }
    throw new ForbiddenException('No authority to perform the operation');
  }
}
