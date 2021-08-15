import { Role, UserPayload } from '@compito/api-interfaces';
import { InternalServerErrorException } from '@nestjs/common';

export const getUserDetails = (
  user: UserPayload | null,
): { role: Role; org: string; projects: string[]; userId: string } => {
  if (user) {
    const {
      'https://compito.adi.so/role': role,
      'https://compito.adi.so/projects': projects,
      'https://compito.adi.so/org': org,
      'https://compito.adi.so/userId': userId,
    } = user;
    return { role: role as Role, org, projects, userId };
  }
  throw new InternalServerErrorException('User data not found');
};
