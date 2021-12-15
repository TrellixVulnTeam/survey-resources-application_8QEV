import { Injectable } from '@angular/core';
import { IState, State } from './models/state';
import { HttpRequestFilter } from './models/http-request-filter';
import { SearchField } from './models/search-field';
import { HttpRequestSort } from './models/http-request-sort';

import { environment } from '@env/environment';
import { StoreServiceService } from './store-service.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state: BehaviorSubject<IState>;
  state$: Observable<IState>;

  //  readonly page$ = this.state$.pipe(map((state) => state.page));
  //  readonly pageSize$ = this.state$.pipe(map((state) => state.pageSize));
  //  readonly recordCount$ = this.state$.pipe(map((state) => state.recordCount));
  //  readonly pageCount$ = this.state$.pipe(map((state) => state.pageCount));
  //  readonly filters$ = this.state$.pipe(map((state) => state.filters));
  //  readonly sorts$ = this.state$.pipe(map((state) => state.sorts));
  //  readonly route$ = this.state$.pipe(map((state) => state.route));

  constructor() {
    this.state = new BehaviorSubject<IState>({
      route: 'home',
      // filters: [],
      //  sorts: [],
      //  recordCount: 0,
      //  page: 1,
      //   pageCount: 0,
      pageSize: 50,
    });
    this.state$ = this.state.asObservable();
  }

  setItem(key: keyof IState, value: any) {
    this.state.next({
      ...this.state.getValue(),
      [key]: value,
    });
    //  alert(JSON.stringify(this.state.getValue()['filters']));
    // this.modivService.load(
    //   this.state.getValue()['filters'],
    //   undefined,
    //   [],
    //   this.state.getValue()['sorts'],
    //   this.state.getValue()['page'],
    //   this.state.getValue()['pageSize'],
    //   false,
    //   false
    // );
  }

  getItem$(key: keyof IState): Observable<any> {
    return this.state$.pipe(
      map((state: IState) => state[key]),
      distinctUntilChanged()
    );
  }

  private getItem(key: keyof State): any {
    return this.state.getValue()[key];
  }

  // setActiveFilter(key: keyof IState, value: any) {

  //   this.state.next({
  //     ...this.state.getValue(),
  //     [key]: value,
  //   });
  // //  alert(JSON.stringify(this.state.getValue()['filters']));
  //   this.modivService.load(
  //     this.state.getValue()['filters'],
  //     undefined,
  //     [],
  //     this.state.getValue()['sorts'],
  //     this.state.getValue()['page'],
  //     this.state.getValue()['pageSize'],
  //     false,
  //     false
  //   );
  // }

  // getActiveFilter$(key: keyof IState): Observable<any> {
  //   return this.state$.pipe(
  //     map((state: IState) => state[key]),
  //     distinctUntilChanged()
  //   );
  // }

  // private getActiveFilter(key: keyof State): any {
  //   return this.state.getValue()[key];
  // }
}
