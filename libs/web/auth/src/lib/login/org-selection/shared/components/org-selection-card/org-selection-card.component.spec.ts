import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSelectionCardComponent } from './org-selection-card.component';

describe('OrgSelectionCardComponent', () => {
  let component: OrgSelectionCardComponent;
  let fixture: ComponentFixture<OrgSelectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSelectionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSelectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
