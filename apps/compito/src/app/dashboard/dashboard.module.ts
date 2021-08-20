import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardsState } from '@compito/web/boards/state';
import { OrgsState } from '@compito/web/orgs/state/orgs.state';
import { ProjectsState } from '@compito/web/projects/state';
import { TasksState } from '@compito/web/tasks/state/tasks.state';
import { ButtonModule, HeaderModule } from '@compito/web/ui';
import { UsersState } from '@compito/web/users/state';
import { NgxsModule } from '@ngxs/store';
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
