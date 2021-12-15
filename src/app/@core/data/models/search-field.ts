export const NumericFldTypes: string[] = [
  'numeric',
  'float',
  'int',
  'bigint',
  'smallint',
  'double',
  'decimal',
  'money',
  'bit',
];
export const StringFldTypes: string[] = ['text', 'memo', 'nvarchar', 'varchar'];
export const DateFldTypes: string[] = ['date', 'datetime', 'smalldatetime', 'time'];
export const MultiSelectControls: string[] = [
  'multiColumnlistBx',
  'txtComboSearch',
  'listBxLong',
  'optionSearch',
  'optionSelect',
  'radioSelect',
];

export interface SearchField {
  ColumnID?: number;
  FieldName: string;
  FieldAlias?: string;
  SortIndex?: number;
  PublicField?: boolean;
  ActiveField?: boolean;
  Instructions?: string;
  Srch_basicAdvanced?: boolean;
  FldLen?: number;
  FldType: string;
  CntrlType: string;
  Operator?: string;
  LookupSource?: string;
  NumRangeHigh?: number;
  NumRangeLow?: number;
  StepValue?: number;
  Label1?: string;
  Label2?: string;
  Value1?: any;
  Value2?: any;
  Placehldr?: string;
  MultiSelect?: boolean;
  ActiveFilter?: boolean;
  isCurrent?: boolean;
  StringValues?: string[];
  NumValues?: number[];
  Group?: string;
}

export interface SearchGroup {
  GroupName: string;
  GroupAlias?: string;
  GroupInstructions?: string;
  GroupIndex?: number;
  PublicGroup: boolean;
  ActiveGroup: boolean;
  ExpandedByDefault: boolean;
  ExpandAllSearchFields: boolean;
  SearchFields: SearchField[];
}

export interface SearchTable {
  TableName: string;
  SearchGroups: SearchGroup[];
  QuickSearchField?: string;
}
