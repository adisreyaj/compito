import { Role } from '@compito/api-interfaces';
import { Roles, ROLE_LEVEL } from '../config/roles.config';

export const hasPermission = (requiredPermission: string, userPermissions: string[]) => {
  if (requiredPermission != null && userPermissions?.length > 0) {
    return userPermissions.includes(requiredPermission);
  }
  return false;
};

export const isOperationAllowed = (requiredRole: Roles, userRole: Role) => {
  if (requiredRole != null && userRole != null) {
    const userRoleLevel = ROLE_LEVEL[userRole.name];
    const requiredRoleLevel = ROLE_LEVEL[requiredRole];
    return userRoleLevel >= requiredRoleLevel;
  }
  return false;
};

export const extractUserRole = (user) => {
  if (user != null && Object.prototype.hasOwnProperty.call(user, 'https://compito.adi.so/roles')) {
    return user['https://compito.adi.so/roles'];
  }
  return [];
};
