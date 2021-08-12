import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconModule, PageHeaderModule, TimeAgoModule } from '@compito/web/ui';
import { TippyModule } from '@ngneat/helipopper';
import { BoardsCardComponent } from '../../shared/components/boards-card/boards-card.component';
import { ProjectsDetailComponent } from './projects-detail.component';

const routes: Routes = [{ path: '', component: ProjectsDetailComponent }];

@NgModule({
  declarations: [ProjectsDetailComponent, BoardsCardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PageHeaderModule, IconModule, TippyModule, TimeAgoModule],
})
export class ProjectsDetailModule {}
