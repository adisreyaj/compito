import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgInviteCardComponent } from './org-invite-card.component';

describe('OrgInviteCardComponent', () => {
  let component: OrgInviteCardComponent;
  let fixture: ComponentFixture<OrgInviteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgInviteCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgInviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
