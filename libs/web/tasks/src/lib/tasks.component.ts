import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataLoading, DataLoadingState, Task } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { TasksActions } from './state/tasks.actions';
import { TasksState } from './state/tasks.state';

@Component({
  selector: 'compito-tasks',
  templateUrl: './tasks.component.html',
  styles: [
    `
      .tasks {
        &__container {
          @apply pb-10;
        }
        &__list {
          @apply pt-8;
          @apply grid gap-4;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [{ label: 'Home', link: '/' }];

  @Select(TasksState.getMyTasks)
  tasks$!: Observable<Task[]>;

  @Select(TasksState.tasksLoading)
  tasksLoading$!: Observable<DataLoading>;
  @Select(TasksState.tasksFetched)
  tasksFetched$!: Observable<boolean>;

  uiView$: Observable<DataLoading> = this.tasksLoading$.pipe(
    withLatestFrom(this.tasksFetched$),
    map(([loading, fetched]) => {
      if (fetched) {
        return { type: DataLoadingState.success };
      }
      return loading;
    }),
  );
  constructor(private store: Store, private auth: AuthService) {}

  ngOnInit(): void {
    this.store.dispatch(new TasksActions.GetMyTasks());
  }
}
