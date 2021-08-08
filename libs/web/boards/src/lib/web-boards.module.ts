import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardsComponent } from './boards.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BoardsComponent,
      },
    ]),
  ],
  declarations: [BoardsComponent],
})
export class WebBoardsModule {}
