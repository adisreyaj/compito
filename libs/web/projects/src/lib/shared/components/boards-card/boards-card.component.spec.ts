import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsCardComponent } from './boards-card.component';

describe('BoardsCardComponent', () => {
  let component: BoardsCardComponent;
  let fixture: ComponentFixture<BoardsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
