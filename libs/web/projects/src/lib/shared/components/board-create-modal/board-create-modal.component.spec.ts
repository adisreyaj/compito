import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCreateModalComponent } from './board-create-modal.component';

describe('BoardCreateModalComponent', () => {
  let component: BoardCreateModalComponent;
  let fixture: ComponentFixture<BoardCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
