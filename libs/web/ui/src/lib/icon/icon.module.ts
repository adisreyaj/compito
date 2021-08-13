import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiAddCircleLine,
  RiAddLine,
  RiArrowDownSLine,
  RiAttachment2,
  RiBuildingLine,
  RiCheckboxLine,
  RiCheckLine,
  RiCloseLine,
  RiDragMoveLine,
  RiFolder4Line,
  RiHome5Line,
  RiMessage3Line,
  RiMore2Fill,
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
  RiMore2Fill,
  RiAddLine,
  RiDragMoveLine,
  RiCloseLine,
  RiMessage3Line,
  RiAttachment2,
  RiCheckLine,
};

@NgModule({
  declarations: [],
  imports: [CommonModule, RemixIconModule.configure(icons)],
  exports: [RemixIconModule],
})
export class IconModule {}
