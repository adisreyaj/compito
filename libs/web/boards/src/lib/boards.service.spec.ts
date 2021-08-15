import { TestBed } from '@angular/core/testing';

import { BoardsService } from './boards.service';

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
