import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BoardCardModule,
  IconModule,
  PageHeaderModule,
  PriorityColorDirectiveModule,
  ProjectCardModule,
  SectionHeaderModule,
  TimeAgoModule,
} from '@compito/web/ui';
import { NgxsModule } from '@ngxs/store';
import { HomeComponent } from './home.component';
import { TaskListComponent } from './shared/components/task-list/task-list.component';
import { HomeState } from './state/home.state';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    NgxsModule.forFeature([HomeState]),
    IconModule,
    TimeAgoModule,
    PriorityColorDirectiveModule,
    ProjectCardModule,
    BoardCardModule,
    SectionHeaderModule,
    PageHeaderModule,
  ],
  declarations: [HomeComponent, TaskListComponent],
})
export class WebHomeModule {}
