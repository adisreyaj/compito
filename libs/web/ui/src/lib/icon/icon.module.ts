import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiAddCircleLine,
  RiNotification2Line,
} from 'angular-remix-icon';
const icons = {
  RiNotification2Line,
  RiAddCircleLine,
};

@NgModule({
  declarations: [],
  imports: [CommonModule, RemixIconModule.configure(icons)],
  exports: [RemixIconModule],
})
export class IconModule {}
