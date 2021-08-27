import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@compito/api-interfaces';

@Pipe({
  name: 'superUser',
})
export class SuperUserPipe implements PipeTransform {
  transform(users: User[]): string[] {
    try {
      if (users?.length > 0) {
        const superAdminUsers = users.filter(({ roles }) => roles[0].role.name === 'super-admin');
        return superAdminUsers.map(({ id }) => id);
      }
    } catch (error) {
      return [];
    }
    return [];
  }
}
