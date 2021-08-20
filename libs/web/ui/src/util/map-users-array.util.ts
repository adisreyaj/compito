import { User } from '@prisma/client';

export const userMapToArray = (map: Map<any, User>) => {
  return [...map.values()].map(({ email, image, firstName }) => {
    return {
      image: image ?? `https://avatar.tobi.sh/${email}`,
      name: firstName,
    };
  });
};
