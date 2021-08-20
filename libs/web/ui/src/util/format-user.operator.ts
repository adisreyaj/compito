import { UserDetails } from '@compito/api-interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function formatUser() {
  return function (source: Observable<any>): Observable<UserDetails | null> {
    return source.pipe(
      map((data: any) => {
        if (data == null) {
          return null;
        } else {
          const { family_name, nickname, name, picture, updated_at, email, email_verified, sub } = data;
          return {
            role: data['https://compito.adi.so/role'],
            userId: data['https://compito.adi.so/userId'],
            org: data['https://compito.adi.so/org'],
            family_name,
            nickname,
            name,
            picture,
            updated_at,
            email,
            email_verified,
            sub,
          } as UserDetails;
        }
      }),
    );
  };
}
