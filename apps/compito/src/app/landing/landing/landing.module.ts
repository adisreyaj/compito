import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule } from '@compito/web/ui';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, ButtonModule, IconModule],
})
export class LandingModule {}
