import { Component, OnInit, OnChanges } from '@angular/core';
import {
  Router,
  Event,
  ActivatedRoute,
  ParamMap,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';

import { QueryRecordCount } from '@app/@core/data/models/query-record-count';

import { IState, State } from '@app/@core/data/models/state';
import { SurveyResourcesServiceService } from '@app/@core/data/survey-resources-service.service';
@Component({
  selector: 'app-data-paging',
  templateUrl: './data-paging.component.html',
  styleUrls: ['../data-container/data-container.component.scss', './data-paging.component.scss'],
})
export class DataPagingComponent implements OnInit {
  controller: string = '';
  page = 1;
  newPage = 1;
  paging: QueryRecordCount = { recordCount: 0, pageCount: 0, pageSize: 25 };
  newPageSize: number = 0;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private surveyResourceService: SurveyResourcesServiceService
  ) {
    let rt = this.router.url;

    if (rt.includes('tax-records')) {
      this.controller = 'tax-records';
    } else if (rt.includes('sr1as')) {
      this.controller = 'sr1a';
    } else if (rt.includes('appeals')) {
      this.controller = 'appeals';
    }
  }

  setPaging() {
    switch (this.controller) {
      case 'tax-records':
        this.surveyResourceService.paging$.subscribe((paging) => {
          this.paging = paging;
          this.newPageSize = paging.pageSize;
        });

        this.surveyResourceService.page$.subscribe((page) => {
          this.page = page;
        });

        break;
      case 'sr1as':
        break;

      case 'appeals':
        break;
      default:
    }
  }

  ngOnInit(): void {
    this.setPaging();
    this.newPage = this.page;
  }
  // call to data store
  updatePage(pg: number) {
    this.surveyResourceService.updatePage(pg);
  }

  changePageSize(p: number) {
    if (p > 0 && p < 1000) {
      this.surveyResourceService.updatePageSize(p);
    }
  }

  toPage(p: number) {
    // enforce the number is within the range of the pageCount
    let pg = Math.max(1, p);
    pg = Math.min(this.paging.pageCount, pg);
    this.newPage = pg;
    this.updatePage(pg);
  }
  first() {
    this.newPage = 1;
    this.updatePage(1);
  }

  previous() {
    let i = (this.newPage -= 1);

    //don't let user go below page 1
    i = Math.max(1, i);
    this.newPage = i;
    this.updatePage(i);
  }
  next() {
    let i = (this.newPage += 1);

    // don't let user go past last page
    i = Math.min(this.paging.pageCount, i);
    this.newPage = i;
    this.updatePage(i);
  }

  last() {
    this.newPage = this.paging.pageCount;
    this.updatePage(this.paging.pageCount);
  }
}
