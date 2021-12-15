export interface LookupTable {
  key: any;
  value?: any;
  group?: string;
  selected?: boolean;
}
export interface LookupMetadata {
  Name: string;
  TableSource?: string;
  LookupType: string;
  Values: LookupTable[];
}
