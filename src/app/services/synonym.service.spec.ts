import { TestBed } from '@angular/core/testing';

import { SynonymService } from './synonym.service';

describe('SynonymService', () => {
  let service: SynonymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynonymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
