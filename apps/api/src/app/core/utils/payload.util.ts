import { UserPayload } from '@compito/api-interfaces';
import { InternalServerErrorException } from '@nestjs/common';
import { Roles } from '../config/roles.config';

export const getUserDetails = (user: UserPayload | null): { role: Roles; org: string; userId: string } => {
  if (user) {
    const {
      'https://compito.adi.so/roles': roles,
      'https://compito.adi.so/org': org,
      'https://compito.adi.so/userId': userId,
    } = user;
    return { role: roles[0] as Roles, org, userId };
  }
  throw new InternalServerErrorException('User data not found');
};
