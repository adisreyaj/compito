import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreateModalComponent } from './users-create-modal.component';

describe('UsersCreateModalComponent', () => {
  let component: UsersCreateModalComponent;
  let fixture: ComponentFixture<UsersCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
