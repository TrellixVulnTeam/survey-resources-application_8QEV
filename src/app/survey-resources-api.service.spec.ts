import { TestBed } from '@angular/core/testing';

import { SurveyResourcesApiService } from './survey-resources-api.service';

describe('SurveyResourcesApiService', () => {
  let service: SurveyResourcesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResourcesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
