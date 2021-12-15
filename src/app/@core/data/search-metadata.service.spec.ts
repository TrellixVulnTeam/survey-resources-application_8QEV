import { TestBed } from '@angular/core/testing';

import { SearchMetadataService } from './search-metadata.service';

describe('SearchMetadataService', () => {
  let service: SearchMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
