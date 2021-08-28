import { Inject, NgModule, Pipe, PipeTransform } from '@angular/core';
import { API_TOKEN } from '../../tokens';

@Pipe({
  name: 'assetUrl',
})
export class AssetUrlPipe implements PipeTransform {
  constructor(@Inject(API_TOKEN) private apiURL: string) {}
  transform(filePath: string) {
    if (!filePath) {
      return null;
    }
    return `${this.apiURL}/assets/${filePath}`;
  }
}

@NgModule({
  declarations: [AssetUrlPipe],
  exports: [AssetUrlPipe],
})
export class AssetUrlPipeModule {}
