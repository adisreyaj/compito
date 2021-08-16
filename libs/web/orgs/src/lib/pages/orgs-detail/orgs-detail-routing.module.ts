import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgsDetailComponent } from './orgs-detail.component';

const routes: Routes = [{ path: '', component: OrgsDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgsDetailRoutingModule { }
