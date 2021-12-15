import { HttpRequestFilter } from './http-request-filter';
import { HttpRequestSort } from './http-request-sort';
import { SearchField } from './search-field';

export interface IState {
  route: string;
  // filters: SearchField[];
  // sorts: HttpRequestSort[];
  // recordCount: number;
  //  page: number;
  //  pageCount: number;
  pageSize: number;
}

export class State implements IState {
  constructor(
    public route: string,
    //   public filters: SearchField[],
    //   public sorts: HttpRequestSort[],
    //   public recordCount: number,
    //   public page: number,
    public pageSize: number
  ) {
    this.route = route;
    //   this.filters = filters;
    //    this.sorts = sorts;
    //    this.recordCount = recordCount;
    //    this.page = page;
    this.pageSize = pageSize;
  }
}
