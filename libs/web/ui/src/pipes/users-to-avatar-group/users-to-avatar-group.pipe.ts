import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@compito/api-interfaces';
import { UserAvatarGroupData } from '../../components/user-avatar-group';

@Pipe({
  name: 'usersToAvatarGroup',
})
export class UsersToAvatarGroupPipe implements PipeTransform {
  transform(value: User[]): UserAvatarGroupData[] {
    if (value?.length > 0) {
      return value.map(({ email, image, firstName }) => {
        return {
          image: image ?? `https://avatar.tobi.sh/${email}`,
          name: firstName,
        };
      });
    }
    return [];
  }
}
