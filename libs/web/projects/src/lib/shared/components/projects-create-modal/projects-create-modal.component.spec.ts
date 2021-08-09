import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsCreateModalComponent } from './projects-create-modal.component';

describe('ProjectsCreateModalComponent', () => {
  let component: ProjectsCreateModalComponent;
  let fixture: ComponentFixture<ProjectsCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
