import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsCardComponent } from './orgs-card.component';

describe('OrgsCardComponent', () => {
  let component: OrgsCardComponent;
  let fixture: ComponentFixture<OrgsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
