import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiAddCircleLine,
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiAttachment2,
  RiBuildingLine,
  RiCheckboxLine,
  RiCheckLine,
  RiCloseLine,
  RiDragMoveLine,
  RiFolder4Line,
  RiHome5Line,
  RiInformationLine,
  RiMenuLine,
  RiMessage3Line,
  RiMore2Fill,
  RiNotification2Line,
  RiTableLine,
  RiUserSettingsLine,
  RiUserShared2Line,
} from 'angular-remix-icon';
const icons = {
  RiMenuLine,
  RiInformationLine,
  RiNotification2Line,
  RiUserSettingsLine,
  RiUserShared2Line,
  RiAddCircleLine,
  RiArrowRightLine,
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
