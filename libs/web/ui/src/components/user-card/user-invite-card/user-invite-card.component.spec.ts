import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInviteCardComponent } from './user-invite-card.component';

describe('UserInviteCardComponent', () => {
  let component: UserInviteCardComponent;
  let fixture: ComponentFixture<UserInviteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInviteCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
