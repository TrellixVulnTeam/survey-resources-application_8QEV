import { TestBed } from '@angular/core/testing';

import { SurveyResourcesServiceService } from './survey-resources-service.service';

describe('SurveyResourcesServiceService', () => {
  let service: SurveyResourcesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResourcesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
