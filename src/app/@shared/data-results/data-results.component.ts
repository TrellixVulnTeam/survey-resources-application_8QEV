import { Component, OnInit } from '@angular/core';
import { DataCardComponent } from '../data-card/data-card.component';

import { DataPagingComponent } from '../data-paging/data-paging.component';
import { SurveyResourcesCard } from '@app/@core/data/models/isurveyresources';

import { IState, State } from '@app/@core/data/models/state';
import { SurveyResourcesServiceService } from '@app/@core/data/survey-resources-service.service';
@Component({
  selector: 'app-data-results',
  templateUrl: './data-results.component.html',
  styleUrls: ['../data-container/data-container.component.scss', './data-results.component.scss'],
})
export class DataResultsComponent implements OnInit {
  surveyResources$: SurveyResourcesCard[] = [];
  constructor(private surveyResourcesService: SurveyResourcesServiceService) {}

  ngOnInit(): void {
    this.surveyResourcesService.items$.subscribe((b) => {
      this.surveyResources$ = b;
    });
  }
}
