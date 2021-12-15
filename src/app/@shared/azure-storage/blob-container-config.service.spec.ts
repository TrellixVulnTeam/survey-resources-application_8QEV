import { TestBed } from '@angular/core/testing';

import { BlobContainerConfigService } from './blob-container-config.service';

describe('BlobContainerConfigService', () => {
  let service: BlobContainerConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlobContainerConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
