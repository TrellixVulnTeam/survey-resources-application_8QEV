import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  Router,
  Event,
  ActivatedRoute,
  ParamMap,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { StateService } from '@app/@core/data/state.service';
import { IState, State } from '@app/@core/data/models/state';
import { SurveyResourcesServiceService } from '@app/@core/data/survey-resources-service.service';
import { HttpRequestFilter } from '@app/@core/data/models/http-request-filter';

import { HttpRequestSort } from '@app/@core/data/models/http-request-sort';
import { SearchMetadataService } from '@app/@core/data/search-metadata.service';

import { SearchField, SearchGroup } from '@app/@core/data/models/search-field';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss', './data-filter.component.scss'],

  //Animation is breaking the ability to switch to the 'about' tab

  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style ({ height: '0px', minHeight: '0' })),
  //     state('expanded', style({ height: '*' })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1')),
  //   ]),
  // ],
})
export class DataFilterComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  searchGroups: SearchGroup[] = [];
  quickSearch: string = '';
  public activeFilter: SearchField | undefined;

  Reset() {
    this.surveyResourceService.filters$;
  }

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private surveyResourceService: SurveyResourcesServiceService,
    private stateService: StateService,
    private searchMetadataService: SearchMetadataService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // alert(this.currentRoute + ' - ' + event.url)
        this.currentRoute = event.url;

        if (event.url.includes('about')) {
          this.searchMetadataService.getSurveyResourceMetadata();
          this.searchMetadataService.searchGroups$.subscribe((data) => {
            this.searchGroups = data;
          });
        }
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }
  toggleGroup(groupi: number) {
    this.searchMetadataService.setActiveSearchGroup(groupi);
  }
  toggleField(groupi: number, fieldi: number) {
    this.searchMetadataService.setCurrentSearchField(groupi, fieldi);
    // alert(JSON.stringify(field))
  }
  selectField(field: SearchField) {
    this.activeFilter = field;
    // alert(JSON.stringify(field))
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
