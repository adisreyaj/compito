import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('@compito/web/home').then((m) => m.WebHomeModule),
      },
      {
        path: 'orgs',
        loadChildren: () => import('@compito/web/orgs').then((m) => m.WebOrgsModule),
      },
      {
        path: 'projects',
        loadChildren: () => import('@compito/web/projects').then((m) => m.WebProjectsModule),
      },
      {
        path: 'boards',
        loadChildren: () => import('@compito/web/boards').then((m) => m.WebBoardsModule),
      },
      {
        path: 'tasks',
        loadChildren: () => import('@compito/web/tasks').then((m) => m.WebTasksModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('@compito/web/profile').then((m) => m.WebProfileModule),
      },
      {
        path: 'users',
        loadChildren: () => import('@compito/web/users').then((m) => m.WebUsersModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('@compito/web/settings').then((m) => m.WebSettingsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
