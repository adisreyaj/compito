import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | undefined | null) {
    if (value == null) return null;
    try {
      return timeago.format(value);
    } catch (error) {
      return null;
    }
  }
}
