import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchField, SearchGroup, SearchTable } from './models/search-field';
import { ReplaySubject, BehaviorSubject, Observable, combineLatest, of, pipe } from 'rxjs';
import { switchMap, shareReplay, map, tap, pluck, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchMetadataService {
  private _searchGroups$: BehaviorSubject<SearchGroup[]> = new BehaviorSubject<SearchGroup[]>([]);
  public searchGroups$: Observable<SearchGroup[]>;
  public activeFilters$: Observable<SearchField[] | undefined>;
  public currentSearchField$: Observable<SearchField | undefined>;
  public currentSearchGroup$: Observable<SearchGroup | undefined>;

  constructor(protected http: HttpClient) {
    this.getSurveyResourceMetadata();

    this.searchGroups$ = this._searchGroups$.asObservable();

    this.currentSearchGroup$ = this._searchGroups$.pipe(map((sg) => sg.find((a) => a.ActiveGroup === true)));

    this.currentSearchField$ =
      this._searchGroups$.pipe(
        map((sg) => sg.find((a) => a.ActiveGroup === true)?.SearchFields.find((f) => f.isCurrent === true))
      ) || undefined;

    this.activeFilters$ =
      this._searchGroups$.pipe(
        map((sg) =>
          sg
            .find((a) => a.ActiveGroup === true)
            ?.SearchFields.filter((f) => f.ActiveFilter === true)
            .map((f) => {
              return f;
            })
        )
      ) || undefined;
  }

  getSurveyResourceMetadata() {
    return this.http.get<SearchTable>('/assets/data/survey-resources-metadata.json').subscribe((st) => {
      this._searchGroups$.next(
        st.SearchGroups.map((sg) => {
          sg.ActiveGroup = false;
          return sg;
        })
      );
    });
  }

  setActiveSearchGroup(gi: number) {
    console.log('setActiveSearchGroup');

    const ng = this._searchGroups$.getValue().map((item, index) => {
      var temp = Object.assign({}, item);
      if (index === gi) {
        temp.ActiveGroup = !temp.ActiveGroup;
      } else {
        temp.ActiveGroup = false;
      }

      return temp;
    });

    this._searchGroups$.next(ng);
  }

  setActiveFilter(gi: number, fi: number) {
    console.log('setActiveSearchField');
    const sg = this._searchGroups$.getValue(); //.find(g=>g.GroupName === gn);

    const v = sg[gi].SearchFields[fi].ActiveFilter;
    sg[gi].SearchFields[fi].ActiveFilter = !v;
    //  console.log(sg[gi].SearchFields[fi]);
    this._searchGroups$.next(sg);
  }

  upsertFilter(f: SearchField) {
    console.log('upsertFilter');
    //  const sg = this._searchGroups$.getValue(); //.find(g=>g.GroupName === gn);

    const sg = this._searchGroups$.getValue().map((item, index) => {
      var temp = Object.assign({}, item);
      if (item.ActiveGroup === true) {
        var fieldlist = temp.SearchFields;
        fieldlist.map((field, index) => {
          var fld = Object.assign({}, field);
          if (fld.FieldName === f.FieldName) {
            fld = f;
          }
          return fld;
        });

        temp.SearchFields = fieldlist;
      }

      return temp;
    });

    //  const v =  sg[gi].SearchFields[fi].ActiveFilter;
    //  sg[gi].SearchFields[fi].ActiveFilter = !v;

    this._searchGroups$.next(sg);
    this.activeFilters$.subscribe({
      next: (value) => console.log('The value is: ', value),
    });
  }
  editCurrentSearchField(f: SearchField) {
    console.log('upsertFilter');
    //  const sg = this._searchGroups$.getValue(); //.find(g=>g.GroupName === gn);

    const sg = this._searchGroups$.getValue().map((item, index) => {
      var temp = Object.assign({}, item);
      if (item.ActiveGroup === true) {
        var fieldlist = temp.SearchFields;
        fieldlist.map((field, index) => {
          var fld = Object.assign({}, field);
          if (fld.FieldName === f.FieldName) {
            fld.isCurrent = true;
          }
          return fld;
        });

        temp.SearchFields = fieldlist;
      }

      return temp;
    });

    //  const v =  sg[gi].SearchFields[fi].ActiveFilter;
    //  sg[gi].SearchFields[fi].ActiveFilter = !v;

    this._searchGroups$.next(sg);
    this.activeFilters$.subscribe({
      next: (value) => console.log('The value is: ', value),
    });
  }

  setCurrentSearchField(gi: number, fi: number) {
    console.log('setCurrentSearchField');
    //  const sg = this._searchGroups$.getValue(); //.find(g=>g.GroupName === gn);

    const sg = this._searchGroups$.getValue().map((item, index) => {
      var temp = Object.assign({}, item);
      if (index === gi) {
        var fieldlist = temp.SearchFields.map((field, index) => {
          var fld = Object.assign({}, field);
          if (index === fi) {
            fld.isCurrent = !fld.isCurrent;
          } else {
            fld.isCurrent = false;
          }
          return fld;
        });

        temp.SearchFields = fieldlist;
      }

      return temp;
    });

    //  const v =  sg[gi].SearchFields[fi].ActiveFilter;
    //  sg[gi].SearchFields[fi].ActiveFilter = !v;
    //  console.log(sg[gi].SearchFields[fi]);
    this._searchGroups$.next(sg);
  }
}
