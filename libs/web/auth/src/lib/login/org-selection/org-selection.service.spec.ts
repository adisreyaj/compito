import { TestBed } from '@angular/core/testing';

import { OrgSelectionService } from './org-selection.service';

describe('OrgSelectionService', () => {
  let service: OrgSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
