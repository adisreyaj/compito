import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCreateModalComponent } from './tasks-create-modal.component';

describe('TasksCreateModalComponent', () => {
  let component: TasksCreateModalComponent;
  let fixture: ComponentFixture<TasksCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
