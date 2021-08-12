import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropListConnection',
})
export class DropListConnectionPipe implements PipeTransform {
  transform(currentId: string, data: any[]): string[] {
    if (data?.length > 0) {
      return data.reduce((acc, curr) => {
        if (curr.name !== currentId) {
          return [...acc, curr.id];
        }
        return acc;
      }, []);
    }
    return [];
  }
}
