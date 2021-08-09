import { Roles, ROLE_LEVEL } from '../config/roles.config';

export const hasPermission = (requiredPermission: string, userPermissions: string[]) => {
  if (requiredPermission != null && userPermissions?.length > 0) {
    return userPermissions.includes(requiredPermission);
  }
  return false;
};

export const isOperationAllowed = (requiredRole: Roles, userRoles: string[]) => {
  if (requiredRole != null && userRoles?.length > 0) {
    const userRole = userRoles[0];
    const userRoleLevel = ROLE_LEVEL[userRole];
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
