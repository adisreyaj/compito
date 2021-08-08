import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrgsComponent } from './orgs.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrgsComponent }]),
  ],
  declarations: [OrgsComponent],
})
export class WebOrgsModule {}
