import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsCreateModalComponent } from './orgs-create-modal.component';

describe('OrgsCreateModalComponent', () => {
  let component: OrgsCreateModalComponent;
  let fixture: ComponentFixture<OrgsCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgsCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgsCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
