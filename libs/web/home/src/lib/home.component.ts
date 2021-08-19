import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Board, Project, Task } from '@compito/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HomeAction } from './state/home.actions';
import { HomeState } from './state/home.state';

@Component({
  selector: 'compito-home',
  templateUrl: './home.component.html',
  styles: [
    `
      .projects {
        &__container {
        }
        &__list {
          @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @Select(HomeState.getProjects)
  projects$!: Observable<Project[]>;

  @Select(HomeState.getBoards)
  boards$!: Observable<Board[]>;

  @Select(HomeState.getHighPriorityTasks)
  hightPriorityTasks$!: Observable<Task[]>;

  @Select(HomeState.getRecentTasks)
  recentTasks$!: Observable<Task[]>;

  user$ = this.auth.user$;

  constructor(private store: Store, private auth: AuthService) {}

  ngOnInit(): void {
    this.store.dispatch(new HomeAction.GetProjects());
    this.store.dispatch(new HomeAction.GetRecentTasks());
    this.store.dispatch(new HomeAction.GetHighPriorityTasks());
    this.store.dispatch(new HomeAction.GetBoards());
  }
}
