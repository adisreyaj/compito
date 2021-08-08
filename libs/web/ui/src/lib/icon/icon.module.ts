import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiAddCircleLine,
  RiArrowDownSLine,
  RiBuildingLine,
  RiCheckboxLine,
  RiFolder4Line,
  RiHome5Line,
  RiNotification2Line,
  RiTableLine,
} from 'angular-remix-icon';
const icons = {
  RiNotification2Line,
  RiAddCircleLine,
  RiHome5Line,
  RiTableLine,
  RiFolder4Line,
  RiCheckboxLine,
  RiBuildingLine,
  RiArrowDownSLine,
};

@NgModule({
  declarations: [],
  imports: [CommonModule, RemixIconModule.configure(icons)],
  exports: [RemixIconModule],
})
export class IconModule {}
