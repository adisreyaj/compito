import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageHeaderModule } from '@compito/web/ui';
import { ProjectsComponent } from './projects.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProjectsComponent },
    ]),
    PageHeaderModule,
  ],
  declarations: [ProjectsComponent],
})
export class WebProjectsModule {}
