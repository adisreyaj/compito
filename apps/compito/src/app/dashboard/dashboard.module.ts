import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, HeaderModule } from '@compito/web/ui';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, ButtonModule, HeaderModule],
})
export class DashboardModule {}
