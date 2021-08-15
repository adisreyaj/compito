import { Role, UserPayload } from '@compito/api-interfaces';
import { InternalServerErrorException } from '@nestjs/common';

export const getUserDetails = (user: UserPayload | null): { role: Role; org: string; userId: string } => {
  if (user) {
    const {
      'https://compito.adi.so/roles': role,
      'https://compito.adi.so/org': org,
      'https://compito.adi.so/userId': userId,
    } = user;
    return { role: role as Role, org, userId };
  }
  throw new InternalServerErrorException('User data not found');
};
