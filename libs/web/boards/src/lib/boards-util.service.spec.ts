import { TestBed } from '@angular/core/testing';

import { BoardsUtilService } from './boards-util.service';

describe('BoardsUtilService', () => {
  let service: BoardsUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardsUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
