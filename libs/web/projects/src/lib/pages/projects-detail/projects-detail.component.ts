import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@compito/api-interfaces';
import { Breadcrumb } from '@compito/web/ui';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BoardCreateModalComponent } from '../../shared/components/board-create-modal/board-create-modal.component';
import { ProjectsAction } from '../../state/projects.actions';
import { ProjectsState } from '../../state/projects.state';

@Component({
  selector: 'compito-projects-detail',
  templateUrl: './projects-detail.component.html',
  styles: [
    `
      .projects {
        &__container {
          @apply pb-6 pt-4;
          &:not(:last-child) {
            @apply border-b;
          }
        }
        &__list {
          @apply pt-2;
          @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4;
        }
      }
    `,
  ],
})
export class ProjectsDetailComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/' },
    { label: 'Projects', link: '/projects' },
  ];

  @Select(ProjectsState.getProjectDetail)
  projectDetails$!: Observable<Project | null>;

  constructor(private dialog: DialogService, private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.projectId) {
      this.store.dispatch(new ProjectsAction.Get(this.projectId));
    }
  }

  addNewBoard() {
    if (this.projectId) {
      const ref = this.dialog.open(BoardCreateModalComponent, {
        data: {
          projectId: this.projectId,
        },
      });
      ref.afterClosed$.subscribe((data) => {
        if (data) {
          this.store.dispatch(new ProjectsAction.AddBoard(data));
        }
      });
    }
  }

  private get projectId() {
    return this.activatedRoute.snapshot.params?.id || null;
  }
}
