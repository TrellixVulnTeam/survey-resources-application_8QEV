export class QueryRecordCount {
  constructor(public recordCount: number, public pageCount: number, public pageSize: number) {
    this.recordCount = recordCount;
    this.pageCount = pageCount;
    this.pageSize = pageSize;
  }
}
