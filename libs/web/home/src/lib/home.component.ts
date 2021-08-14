import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Project, Task } from '@compito/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HomeAction } from './state/home.actions';
import { HomeState } from './state/home.state';

@Component({
  selector: 'compito-home',
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @Select(HomeState.getProjects)
  projects$!: Observable<Project[]>;

  @Select(HomeState.getHighPriorityTasks)
  hightPriorityTasks$!: Observable<Task[]>;

  @Select(HomeState.getRecentTasks)
  recentTasks$!: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeAction.GetProjects());
    this.store.dispatch(new HomeAction.GetRecentTasks());
    this.store.dispatch(new HomeAction.GetHighPriorityTasks());
  }
}
