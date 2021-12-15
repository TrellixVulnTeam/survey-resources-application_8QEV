export class QuickSearch {
  constructor(public filterFields: string[], public value: string) {
    this.filterFields = filterFields;
    this.value = value;
  }
}
