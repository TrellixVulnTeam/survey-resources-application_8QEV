export interface HttpRequestFilter {
  FieldName?: string;
  FieldAlias?: string;
  Operator?: string;
  CntrlType?: string;
  StringValues?: string[];
  NumValues?: number[];
  Group?: string;
}
