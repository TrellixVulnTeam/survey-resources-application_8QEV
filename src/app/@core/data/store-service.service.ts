import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { StoreSettings } from './models/store-settings';
import { HttpRequestFilter } from '@app/@core/data/models/http-request-filter';
import { HttpRequestSort } from '@app/@core/data/models/http-request-sort';
import { SearchField } from './models/search-field';
import { QueryRecordCount } from './models/query-record-count';
import { QuickSearch } from './models/quick-search';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class StoreServiceService<T> {
  private itemsSubject = new BehaviorSubject<T[]>([]);
  items$ = this.itemsSubject.asObservable();

  protected get items(): T[] {
    return this, this.itemsSubject.getValue();
  }
  protected set items(val: T[]) {
    this.itemsSubject.next(val ? [...val] : []);
  }

  // paging
  private pagingSubject = new BehaviorSubject<QueryRecordCount>({ recordCount: 0, pageCount: 0, pageSize: 25 });
  paging$ = this.pagingSubject.asObservable();

  protected get paging(): QueryRecordCount {
    return this.pagingSubject.getValue();
  }
  protected set paging(val: QueryRecordCount) {
    this.pagingSubject.next(val ? val : { recordCount: 0, pageCount: 0, pageSize: 25 });
  }

  // page
  private pageSubject = new BehaviorSubject<number>(1);
  page$ = this.pageSubject.asObservable();

  protected get page(): number {
    return this.pageSubject.getValue();
  }
  protected set page(val: number) {
    this.pageSubject.next(val ? val : 1);
  }

  // filters
  private filtersSubject = new BehaviorSubject<SearchField[]>([]);
  filters$ = this.filtersSubject.asObservable();

  protected get filters(): SearchField[] {
    return this.filtersSubject.getValue();
  }
  protected set filters(val: SearchField[]) {
    this.filtersSubject.next(val ? val : []);
  }

  // quick search
  private quickSearchSubject = new BehaviorSubject<QuickSearch>({ filterFields: ['QSearch'], value: '' });
  quickSearch$ = this.quickSearchSubject.asObservable();

  protected get quickSearch(): QuickSearch {
    return this.quickSearchSubject.getValue();
  }
  protected set quickSearch(val: QuickSearch) {
    this.quickSearchSubject.next(val ? val : { filterFields: [], value: '' });
  }

  // sorts
  private sortsSubject = new BehaviorSubject<HttpRequestSort[]>([
    { FieldAlias: 'PAMS_PIN', FieldName: 'PAMS_PIN', Direction: 'Asc' },
  ]);
  sorts$ = this.sortsSubject.asObservable();

  protected get sorts(): HttpRequestSort[] {
    return this.sortsSubject.getValue();
  }
  protected set sorts(val: HttpRequestSort[]) {
    this.sortsSubject.next(val ? val : []);
  }

  // selected
  private selectedSubject = new BehaviorSubject<T | null>(null);
  selected$ = this.selectedSubject.asObservable();

  protected get selected(): T | null {
    return this.selectedSubject.getValue();
  }
  protected set selected(val: T | null) {
    this.selectedSubject.next(val == null ? null : { ...val });
  }

  //loading
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  protected get loading(): boolean {
    return this.loadingSubject.getValue();
  }
  protected set loading(val: boolean) {
    this.loadingSubject.next(val);
  }

  private loadErrorSubject = new Subject<HttpErrorResponse>();
  loadError$ = this.loadErrorSubject.asObservable();

  protected set loadError(val: HttpErrorResponse) {
    this.loadErrorSubject.next(val);
  }

  private getErrorSubject = new Subject<HttpErrorResponse>();
  getError$ = this.getErrorSubject.asObservable();

  protected set getError(val: HttpErrorResponse) {
    this.getErrorSubject.next(val);
  }

  private deletingSubject = new BehaviorSubject<boolean>(false);
  deleting$ = this.deletingSubject.asObservable();

  protected get deleting(): boolean {
    return this.deletingSubject.getValue();
  }
  protected set deleting(val: boolean) {
    this.deletingSubject.next(val);
  }

  protected deleteSuccessSubject = new Subject<T>();
  deleteSuccess$ = this.deleteSuccessSubject.asObservable();

  protected updateSuccessSubject = new Subject<T>();
  updateSuccess$ = this.updateSuccessSubject.asObservable();

  protected createSuccessSubject = new Subject<T>();
  createSuccess$ = this.createSuccessSubject.asObservable();

  private noLoadResultsSubject = new Subject<void>();
  noLoadResults$ = this.noLoadResultsSubject.asObservable();

  constructor(protected http: HttpClient, protected settings: StoreSettings) {}

  updateFilters(filters: SearchField[]) {
    this.filters = filters;

    this.load(false, false);
  }

  removeFilter(fn: string) {
    let filters: SearchField[] = this.filters.filter((f) => f.FieldName !== fn);

    this.updateFilters(filters);
  }

  upsertFilter(filter: SearchField) {
    // three choices
    // 1. no filters exist =>
    // 2. filters exist, but don't include field
    // 3. field is already an active filter

    let filters: SearchField[] = this.filters;

    const filterindex = filters.findIndex((element, index) => {
      return element.FieldName === filter.FieldName ? true : false;
      // if (element.FieldName === filter.FieldName ) {return true }   else return false
    });

    if (filters == undefined) {
      //1
      filters = [filter];
    } else if (filterindex === -1) {
      //2
      filters.push(filter);
    } else {
      filters[filterindex] = filter;
    }

    this.updateFilters(filters);
  }

  updateQuickSearch(qs: QuickSearch) {
    this.quickSearch = qs;
  }

  clearFilters() {
    this.filters = [];
    this.quickSearch = { filterFields: ['QSearch'], value: '' };
    this.resetPaging();
    this.page = 1;
    this.items = [];
  }

  updateSorts(sorts: HttpRequestSort[]) {
    this.sorts = sorts;
    this.page = 1;

    // fetch data with new sort order
    this.load(false, false);
  }
  resetSorts() {
    this.sorts = [{ FieldAlias: 'PAMS_PIN', FieldName: 'PAMS_PIN', Direction: 'Asc' }];
  }

  updatePage(page: number) {
    this.page = page;

    // fetach data with new page
    this.load(false, false);
  }

  resetPaging() {
    this.paging = { recordCount: 0, pageCount: 0, pageSize: 25 };
  }

  updatePageSize(pgSize: number) {
    this.page = 1;
    let paging = this.paging;
    paging.pageCount = Math.ceil(paging.recordCount / pgSize);
    paging.pageSize = pgSize;
    this.paging = paging;

    alert(JSON.stringify(this.paging) + JSON.stringify(paging) + pgSize);
    // reload page 1 with new page size
    this.load(false, false);
  }

  getRecordCount() {
    var searchFilters = this.filters.map(function (res) {
      var v: HttpRequestFilter = {
        FieldName: res.FieldName,
        Operator: res.Operator,
        StringValues: res.StringValues,
        NumValues: res.NumValues,
        Group: res.Group,
      };
      return v;
    });
    const url = `${this.settings.url}count`; // + `?filter=${filter}&order=${order}&page=${page}&pageSize=${pageSize}`;
    const reqBody = {
      page: 1,
      pageSize: this.paging.pageSize,
      filter: searchFilters,
      freeTxtVal: this.quickSearch.value,
      freeTxtFields: this.quickSearch.filterFields,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //,Authorization: 'my-auth-token'
      }),
    };
    this.http
      .post<QueryRecordCount>(url, reqBody, httpOptions)
      .pipe(
        catchError((e) => {
          this.loadError = e;
          return throwError(`Error loading ${this.settings.itemName}s`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.paging = res;
      });
  }
  getLookup(fieldName: string) {
    this.loading = true;
    // const searchFilters: HttpRequestFilter[] = Object.assign(this,filter)
    const searchFilters: HttpRequestFilter[] = this.filters.map(function (res) {
      var v: HttpRequestFilter = {
        FieldName: res.FieldName,
        Operator: res.Operator,
        StringValues: res.StringValues,
        NumValues: res.NumValues,
        Group: res.Group,
      };
      return v;
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //,Authorization: 'my-auth-token'
      }),
    };
    const url = `${this.settings.url}lookup/${fieldName}`;
    const reqBody = {
      page: this.page,
      pageSize: this.paging.pageSize,
      filter: searchFilters,
      freeTxtFields: this.quickSearch.filterFields,
      freeTxtVal: this.quickSearch.value,
      order: this.sorts,
    };

    this.http
      .post<T[]>(url, reqBody, httpOptions)
      .pipe(
        catchError((e) => {
          this.loadError = e;
          return throwError(`Error loading ${this.settings.itemName}s`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        return res;

        if (res.length === 0) {
          return [];
        }
      });
  }
  getFullTextLookup(fieldName: string, fulltext: string) {
    this.loading = true;
    // const searchFilters: HttpRequestFilter[] = Object.assign(this,filter)
    let searchFilters: HttpRequestFilter[] = this.filters.map(function (res) {
      var v: HttpRequestFilter = {
        FieldName: res.FieldName,
        Operator: res.Operator,
        StringValues: res.StringValues,
        NumValues: res.NumValues,
        Group: res.Group,
      };
      return v;
    });
    var filter: HttpRequestFilter = {
      FieldName: fieldName,
      Operator: 'LIKE',
      StringValues: ['%freetext%'],
      NumValues: [],
      Group: 'AND',
    };
    searchFilters.push(filter);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //,Authorization: 'my-auth-token'
      }),
    };
    const url = `${this.settings.url}lookup/${fieldName}`;
    const reqBody = {
      page: this.page,
      pageSize: this.paging.pageSize,
      filter: searchFilters,
      freeTxtFields: this.quickSearch.filterFields,
      freeTxtVal: this.quickSearch.value,
      order: this.sorts,
    };

    this.http
      .post<T[]>(url, reqBody, httpOptions)
      .pipe(
        catchError((e) => {
          this.loadError = e;
          return throwError(`Error loading ${this.settings.itemName}s`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        if (res.length === 0) {
          return [];
        }
        return res;
      });
  }

  getFreeTextLookup(fieldName: string, freetext: string): Observable<string[]> {
    this.loading = true;
    let vals: string[] = [];
    // const searchFilters: HttpRequestFilter[] = Object.assign(this,filter)
    let searchFilters: HttpRequestFilter[] = this.filters.map(function (res) {
      var v: HttpRequestFilter = {
        FieldName: res.FieldName,
        Operator: res.Operator,
        StringValues: res.StringValues,
        NumValues: res.NumValues,
        Group: res.Group,
      };
      return v;
    });
    var filter: HttpRequestFilter = {
      FieldName: fieldName,
      Operator: 'LIKE',
      StringValues: ['%freetext%'],
      NumValues: [],
      Group: 'AND',
    };
    searchFilters.push(filter);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //,Authorization: 'my-auth-token'
      }),
    };
    const url = `${this.settings.url}lookup/${fieldName}`;
    const reqBody = {
      page: this.page,
      pageSize: this.paging.pageSize,
      filter: searchFilters,
      freeTxtFields: this.quickSearch.filterFields,
      freeTxtVal: this.quickSearch.value,
      order: this.sorts,
    };

    return this.http.post<string[]>(url, reqBody, httpOptions).pipe(
      catchError((e) => {
        this.loadError = e;
        return throwError(`Error loading ${this.settings.itemName}s`);
      }),
      finalize(() => (this.loading = false))
    );
    // .subscribe((res) => {
    //   if (res.length === 0) {
    //     return [];
    //   }
    //     vals= res;
    // });
  }

  /**
   * Load data into the store. Objects loaded are exposed through the items$ observable.
   * @param useCache If true and the store already has data, no api call will be made. Default false
   * @param append If true, appends returned data to the existing data, otherwise it replaces the data. Default false
   * @returns void
   */
  load(useCache = false, append = false) {
    if (useCache && this.items?.length > 0) {
      return;
    }
    this.loading = true;
    // const searchFilters: HttpRequestFilter[] = Object.assign(this,filter)
    const searchFilters: HttpRequestFilter[] = this.filters.map(function (res) {
      var v: HttpRequestFilter = {
        FieldName: res.FieldName,
        Operator: res.Operator,
        StringValues: res.StringValues,
        NumValues: res.NumValues,
        Group: res.Group,
      };
      return v;
    });

    if (this.page === 1) {
      this.getRecordCount();
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //,Authorization: 'my-auth-token'
      }),
    };
    const url = this.settings.url; // + `?filter=${filter}&order=${order}&page=${page}&pageSize=${pageSize}`;
    const reqBody = {
      page: this.page,
      pageSize: this.paging.pageSize,
      filter: searchFilters,
      freeTxtFields: this.quickSearch.filterFields,
      freeTxtVal: this.quickSearch.value,
      order: this.sorts,
    };

    this.http
      .post<T[]>(url, reqBody, httpOptions)
      .pipe(
        catchError((e) => {
          this.loadError = e;
          return throwError(`Error loading ${this.settings.itemName}s`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        if (append) {
          this.items = this.items.concat(res);
        } else {
          this.items = res;
        }

        if (res.length === 0) {
          this.noLoadResultsSubject.next();
        }
      });
  }

  /**
   * Gets the object with the given ID and adds it (or replaces it) to the store.
   * Sets the retrieved object as the selected item.
   * @param id The id of the object to get
   * @returns void
   */
  get(id: string | number) {
    if (id === null) {
      this.selected = null;
      return;
    }

    this.loading = true;

    this.http
      .get<T>(`${this.settings.url}${id}`)
      .pipe(
        catchError((e) => {
          this.getError = e;
          return throwError(`Error loading ${this.settings.itemName}`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.replaceOrAdd(res);
        this.selected = res;
      });
  }

  /**
   * Posts the given object to the API and adds the returned object to the store
   * @param val The object to post to the API
   */
  add(val: T) {
    this.loading = true;

    this.http
      .post<T>(`${this.settings.url}`, val)
      .pipe(
        catchError((e) => {
          this.getError = e;
          return throwError(`Error creating ${this.settings.itemName}`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.replaceOrAdd(res);
        this.createSuccessSubject.next(res);
      });
  }

  /**
   * Calls the API with a PUT and passes the given object. Adds or replaces returned object into the store.
   * @param val Object to update via a PUT call
   */
  update(val: T) {
    this.loading = true;
    const id = val[this.settings.idField];

    this.http
      .put<T>(`${this.settings.url}${id}`, val)
      .pipe(
        catchError((e) => {
          this.getError = e;
          return throwError(`Error updating ${this.settings.itemName}`);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.replaceOrAdd(res);
        this.updateSuccessSubject.next(res);
      });
  }

  /**
   * Calls the API with a delete to delete the given object. Removes it from the store on success
   * @param val Object to delete
   */
  delete(val: T) {
    this.deleting = true;
    const id = val[this.settings.idField];

    this.http
      .delete(`${this.settings.url}${id}`)
      .pipe(
        catchError((e) => {
          this.getError = e;
          return throwError(`Error deleting ${this.settings.itemName}`);
        }),
        finalize(() => (this.deleting = false))
      )
      .subscribe((res) => {
        this.remove(val);
        this.deleteSuccessSubject.next(val);
      });
  }

  /**
   * Sets the given object as the selected object. Does not manipulate the data store.
   * @param val Object to select
   */
  select(val: T) {
    this.selected = val;
  }

  /**
   * Gets the object from the local store by the id given. Uses Array.find
   * @param id ID of the object to get from the store
   * @returns T
   */
  getCached(id: string | number): T | undefined {
    return this.items.find((i) => i[this.settings.idField] === id);
  }

  /**
   * Finds a local object with the given predicate and returns the first instance found.
   * Uses Array.find with the predicate as the find content
   * @param predicate Search predicate to use to find the object
   * @returns T
   */
  findCached(predicate: (item: T) => boolean): T | undefined {
    return this.items.find((i) => predicate(i));
  }

  /**
   * Empties the local data store
   */
  clearCached() {
    this.items = [];
  }

  /**
   * Removes the given object from the local data store
   * @param val Object to remove
   */
  protected remove(val: T) {
    this.items = this.items.filter((i) => i[this.settings.idField] !== val[this.settings.idField]);
  }

  /**
   * Adds the given object to the local data store, or replaces it if it already exists
   * @param item Object to add or replace
   */
  protected replaceOrAdd(item: T) {
    const existingIndex = this.items?.findIndex((i) => i[this.settings.idField] === item[this.settings.idField]);

    if (existingIndex >= 0) {
      this.items[existingIndex] = item;
      this.items = this.items;
    } else {
      this.items.push(item);
      this.items = this.items;
    }
  }
}
