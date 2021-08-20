import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private logger = new Logger('PERMISSION GUARD');
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const userPermissions = context.getArgs()[0].user['https://compito.adi.so/role'].permissions;
    if (!routePermissions) {
      return true;
    }

    const hasPermission = () => routePermissions.every((routePermission) => userPermissions.includes(routePermission));
    if (hasPermission()) {
      return true;
    }
    this.logger.error(`User doesn't have permission: ${routePermissions}`);
    throw new ForbiddenException('Not enough permissions to perform the operations');
  }
}
