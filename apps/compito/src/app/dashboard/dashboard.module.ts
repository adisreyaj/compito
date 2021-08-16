import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardsState } from '@compito/web/boards/state';
import { ButtonModule, HeaderModule } from '@compito/web/ui';
import { UsersState } from '@compito/web/users';
import { NgxsModule } from '@ngxs/store';
import { OrgsState } from 'libs/web/orgs/src/lib/state/orgs.state';
import { ProjectsState } from 'libs/web/projects/src/lib/state/projects.state';
import { TasksState } from 'libs/web/tasks/src/lib/state/tasks.state';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    HeaderModule,
    NgxsModule.forFeature([UsersState, OrgsState, ProjectsState, BoardsState, TasksState]),
  ],
})
export class DashboardModule {}
