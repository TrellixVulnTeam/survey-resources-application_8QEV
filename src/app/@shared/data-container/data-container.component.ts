import { Component, OnInit } from '@angular/core';
import { DataBreadcrumbsComponent } from '../data-breadcrumbs/data-breadcrumbs.component';
import { DataFilterComponent } from '../data-filter/data-filter.component';
import { DataResultsComponent } from '../data-results/data-results.component';
import { SearchMetadataService } from '@app/@core/data/search-metadata.service';
import { StateService } from '@app/@core/data/state.service';
import { SurveyResourcesServiceService } from '@app/@core/data/survey-resources-service.service';

@Component({
  selector: 'app-data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss'],
})
export class DataContainerComponent implements OnInit {
  title = 'Survey Resources';
  anyFilters = false;
  anyRecords = false;

  constructor(
    private surveyResourcesService: SurveyResourcesServiceService,
    private stateService: StateService,
    private searchService: SearchMetadataService
  ) {
    this.surveyResourcesService.filters$.subscribe((f) => {
      this.anyFilters = f === undefined ? false : true;
    });
    this.surveyResourcesService.paging$.subscribe((r) => {
      // alert(JSON.stringify(r));
      this.anyRecords = r.recordCount === 0 ? false : true;
    });
  }

  togglePanel(id: string) {
    console.log(`Panel: ${id}`);
  }

  ngOnInit(): void {}
}
