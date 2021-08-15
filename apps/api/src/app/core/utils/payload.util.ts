import { Role, UserPayload } from '@compito/api-interfaces';
import { InternalServerErrorException } from '@nestjs/common';

export const getUserDetails = (user: UserPayload | null): { role: Role; orgs: string[]; userId: string } => {
  if (user) {
    const {
      'https://compito.adi.so/roles': role,
      'https://compito.adi.so/orgs': orgs,
      'https://compito.adi.so/userId': userId,
    } = user;
    return { role: role as Role, orgs, userId };
  }
  throw new InternalServerErrorException('User data not found');
};
