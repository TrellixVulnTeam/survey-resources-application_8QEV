import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  OnInit,
  IterableDiffers,
  HostListener,
  Pipe,
  PipeTransform,
  OnChanges,
  DoCheck,
  SimpleChanges,
} from '@angular/core';
import {
  Router,
  Event,
  ActivatedRoute,
  ParamMap,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LookupMetadata, LookupTable } from '@app/@core/data/models/lookup-metadata';
import { SearchField, NumericFldTypes, StringFldTypes, MultiSelectControls } from '@app/@core/data/models/search-field';
import { StateService } from '@app/@core/data/state.service';
import { SearchMetadataService } from '@app/@core/data/search-metadata.service';
import { SurveyResourcesServiceService } from '@app/@core/data/survey-resources-service.service';

import {
  MunicipalLkup,
  PropertyClassCodeLkup,
  Class4CodeLkup,
  BuildingSubtypeLkup,
  ExemptOwnerLkup,
  ExemptUseLkup,
  ExemptDescriptionLkup,
} from '@app/@core/data/lookup-tables';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, DoCheck, OnChanges {
  @Input() ControlMetadata!: SearchField;

  differ: any; //variable to trach changes in data

  controller: string = 'survey-resources';
  control1: string | undefined;
  control2: string | undefined;
  lookupTab: LookupTable[] = [];

  txtFreeSearch: string = '';
  txtFreeSearchChanged = new Subject<string>();
  freeTextList$!: Observable<string[]>;
  freeTextList: string[] = [];
  list1: string[] | number[] = [];
  stringVals: string[] = [];
  numVals: number[] = [];
  MSControls: boolean = false;
  MunicipalLkup: LookupTable[] = MunicipalLkup.Values;
  PropertyClassCodeLkup: LookupTable[] = PropertyClassCodeLkup.Values;
  val: string = '';
  searchText: string = '';
  selected_count: number = 0;
  selected_items: LookupTable[] | undefined = [];
  labels: string[] = ['0', '25', '50', '75', '100'];
  thumbPosition1: number = 0.3;
  thumbPosition2: number = 0.7;
  activeThumbPosition: string = '';
  isDragStarted: boolean = false;
  svgElement: any;
  isValid = true;
  validationErrorMessage = '';

  setFiltersII() {
    switch (this.controller) {
      case 'survey-resources':
        this.searchSurveyResourceService.upsertFilter(this.ControlMetadata);

        break;
    }
  }

  getSelected() {
    if (this.lookupTab !== undefined) {
      this.selected_items = this.lookupTab.filter((s) => {
        return s.selected;
      });
      this.selected_count = this.selected_items.length;
    } else {
      this.selected_count = 0;
    }
  }

  // Clearing All Selections
  clearSelections() {
    this.searchText = '';
    if (this.lookupTab !== undefined) {
      this.lookupTab = this.lookupTab.filter((g) => {
        g.selected = false;
        return true;
      });
    }

    this.getSelected();
  }

  //Delete Single Listed Game Tag
  removeSelection(id: any) {
    this.searchText = '';
    if (this.lookupTab !== undefined) {
      this.lookupTab = this.lookupTab.filter((g) => {
        if (g.key == id) g.selected = false;

        return true;
      });
    }

    this.getSelected();
  }

  //Clear term types by user
  clearFilter() {
    this.searchText = '';
  }

  freeTextChanged(event: any) {
    this.txtFreeSearchChanged.next(event.target.value);
  }

  constructor(
    route: ActivatedRoute,
    private router: Router,
    //differs: IterableDiffers,
    private searchSurveyResourceService: SurveyResourcesServiceService,
    private stateService: StateService,
    private searchMetadataService: SearchMetadataService
  ) {
    this.txtFreeSearchChanged.pipe(debounceTime(300)).subscribe((value) => {
      alert(value);
      this.searchSurveyResourceService.getFreeTextLookup(this.ControlMetadata.FieldName, value).subscribe((ft) => {
        this.freeTextList = ft;
        alert(JSON.stringify(ft));
      });
    });
  }
  ngDoCheck(): void {}

  ngOnChanges(): void {
    if (this.ControlMetadata.StringValues !== undefined) {
      this.control1 = this.ControlMetadata.StringValues![0];
    }

    if (MultiSelectControls.includes(this.ControlMetadata.CntrlType)) {
      this.MSControls = true;
      if (this.ControlMetadata.LookupSource !== undefined) {
        this.lookupTab = this[this.ControlMetadata.LookupSource];
      } else {
        console.log('SELECT DISTINCT ' + this.ControlMetadata.FieldName + ' FROM ....');
      }
    }

    this.stringVals = this.ControlMetadata.StringValues || [];
    this.numVals = this.ControlMetadata.NumValues || [];
  }

  ngOnInit(): void {
    this.svgElement = document.querySelector('#wrapper');

    if (this.ControlMetadata.StringValues !== undefined) {
      this.control1 = this.ControlMetadata.StringValues![0];
    }
    // this.control1 = this.ControlMetadata.StringValues![0] || this.ControlMetadata.NumValues![0].toString() || undefined;
    // this.control2 = this.ControlMetadata.StringValues![1] || this.ControlMetadata.NumValues![1].toString() || undefined;

    if (MultiSelectControls.includes(this.ControlMetadata.CntrlType)) {
      this.MSControls = true;
      if (this.ControlMetadata.LookupSource !== undefined) {
        this.lookupTab = this[this.ControlMetadata.LookupSource];
      } else {
        // TODO: implement API enpoint to fetch distinct value for control
        //  ... SELECT DISTINCT {{ FieldName }} FROM Controller WHERE CLAUSE ORDER BY {{ FieldName }}
        console.log('SELECT DISTINCT ' + this.ControlMetadata.FieldName + ' FROM ....');
      }
    }
  }

  //svg slider function
  getLabelXPosition(i: number): number {
    return (this.getTotalWidth() / (this.labels.length + 1)) * (i + 1);
  }

  //svg slider function
  getTotalWidth(): number {
    const slider = this.svgElement;
    if (slider) {
      return slider.clientWidth;
    } else {
      return 0;
    }
  }

  //svg slider function
  setThumbPositionObj(input: string): void {
    this.activeThumbPosition! = input;

    this.getThumbPosition(input);
  }

  //svg slider function
  getThumbPosition(input: string): number {
    return this[input] * this.getTotalWidth();
  }

  //svg slider function
  getLineWidth(): number {
    return Math.abs(this.thumbPosition1 - this.thumbPosition2) * this.getTotalWidth();
  }
  //svg slider function
  private updateThumbPosition(position: number): void {
    this[this.activeThumbPosition] = position / this.getTotalWidth();
  }

  // @HostListener('mousedown', ['$event'])
  // public onMouseDown(event: any): void {

  //   this.isDragStarted = true;
  //   this.updateThumbPosition(event.offsetX);
  //   event.stopPropagation();
  //   event.preventDefault();
  // }

  // @HostListener('mousemove', ['$event'])
  // public onMouseMove(event: any): void {
  //   if (this.isDragStarted) {
  //     this.updateThumbPosition(event.offsetX);
  //     event.stopPropagation();
  //     event.preventDefault();
  //   }
  // }

  // @HostListener('mouseup')
  // public onMouseUp(): void {
  // //  alert(Math.abs(this.thumbPosition1 - this.thumbPosition2))
  //   this.isDragStarted = false;
  // }

  // @HostListener('mouseleave')
  // public onMouseLeave(): void {
  //   this.isDragStarted = false;
  // }

  // @HostListener('touchmove', ['$event'])
  // public onTouchMove(event: any): void {
  //   this.updateThumbPosition(event.touches[0].clientX - this.svgElement.getBoundingClientRect().left)
  // }

  // @HostListener('dragstart', ['$event'])
  // public onDragStart(event: any): void {
  //   event.stopPropagation();
  //   event.preventDefault();
  // }

  //UPSERTFILTER: function to add or update a filter in the active data store
  //  the Control metatdata, which is a searchField object, will need to add either a NumValue(s) or a StringValues from the user inputs.
  //  the "operator" will also need to be added, based on control type and user input.
  //  we have to determine whether input is a string or number to help build string queuries.
  //  _________________________________________________________________________________________
  upsertFilter() {
    switch (this.ControlMetadata?.CntrlType) {
      case 'multiColumnlistBx': {
        if (NumericFldTypes.includes(this.ControlMetadata.FldType)) {
          this.ControlMetadata.NumValues = this.selected_items?.map((i) => i.key);
        } else {
          this.ControlMetadata.StringValues = this.selected_items?.map((i) => i.key);
        }
        this.ControlMetadata.Operator = 'IN';
        break;
      }
      case 'txtFreeSearch': {
        //statements;
        break;
      }
      case 'txtSearch': {
        if (NumericFldTypes.includes(this.ControlMetadata.FldType)) {
          this.ControlMetadata.NumValues = [Number(this.control1)];
        } else {
          this.ControlMetadata.StringValues = [this.control1 || ''];
        }
        this.ControlMetadata.Operator = '=';
        //statements;
        break;
      }
      case 'rangeValue': {
        //statements;
        break;
      }
      case 'rangeDate': {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    // this.upsert.emit({
    //   FieldName: this.ControlMetadata.FieldName,
    //   FieldAlias: this.ControlMetadata.FieldAlias,
    //   CntrlType: this.ControlMetadata.CntrlType,
    //   //NumValues: e.t,
    //   StringValues:e

    //   })
    this.ControlMetadata!.ActiveFilter = true;
    this.ControlMetadata!.isCurrent = false;
    if (this.ControlMetadata !== undefined) {
      //check to see if element is already an active filter...then replace the value(below)
      this.setFiltersII();
      // let filters = this.Filters;

      // alert(JSON.stringify(filters))
      //  let filterindex = filters.findIndex((element, index) => {
      //   if (element.FieldName === this.ControlMetadata.FieldName ) {
      //     return true
      //   }
      //   else return false
      // });

      // alert(`filterindex ${filterindex}`);
      //  ///three choices
      //  // 1. no filters exist =>
      //  // 2. filters exist, but don't include field
      //  // 3. field is already an active filter

      //   if (this.Filters == undefined) //1
      //   {
      //     let fArray: SearchField[] = [this.ControlMetadata];
      //     filters = fArray;
      //   } else if (filterindex === -1) //2
      //   {
      //     filters.push(this.ControlMetadata);
      //     alert(JSON.stringify(filters))
      //   }
      //   else
      //   {
      //    filters[filterindex] = this.ControlMetadata
      //   }
      //   this.modivService.updateFilters(filters);

      //  // this.searchMetadataService.upsertFilter(this.ControlMetadata)
    }

    console.log('upsert filter with val:');
    console.log(this.ControlMetadata);
  }

  removeFilter(fn: string) {
    switch (this.controller) {
      case 'tax-records':
        this.searchSurveyResourceService.removeFilter(fn);
        break;
      case 'sr1as':
        //  this.sr1aService.removeFilter(fn);
        break;

      case 'appeals':
        //  this.appealService.removeFilter(fn);
        break;
    }
  }
}
