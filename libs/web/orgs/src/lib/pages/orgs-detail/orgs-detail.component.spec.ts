import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsDetailComponent } from './orgs-detail.component';

describe('OrgsDetailComponent', () => {
  let component: OrgsDetailComponent;
  let fixture: ComponentFixture<OrgsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
