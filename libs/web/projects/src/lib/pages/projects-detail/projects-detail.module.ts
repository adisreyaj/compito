import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHeaderModule } from '@compito/web/ui';
import { ProjectsDetailComponent } from './projects-detail.component';

const routes: Routes = [{ path: '', component: ProjectsDetailComponent }];

@NgModule({
  declarations: [ProjectsDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PageHeaderModule],
})
export class ProjectsDetailModule {}
