import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleUpdateModalComponent } from './user-role-update-modal.component';

describe('UserRoleUpdateModalComponent', () => {
  let component: UserRoleUpdateModalComponent;
  let fixture: ComponentFixture<UserRoleUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
