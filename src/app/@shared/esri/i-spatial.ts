export interface ISpatial {}

//used as input model
export class PopupTemplate {
  public title!: string;
  public outFields?: any;
  public content!: any;
}

//used as input model
export class DynamicLayer {
  public type!: string;
  public mapLayerId!: number;
}
//used as input model
export class ESRISublayer {
  public id!: number;
  public definitionExpression?: string = '';
  public fields?: string[] = [];
  public title?: string = '';
  public legendEnabled?: boolean = false;
  public listMode?: string = '';
  public opacity?: number = 1;
  public visible?: boolean = true;
  public labelsVisible?: boolean = false;
  public popupEnabled?: boolean = false;
  public typeIdField?: string = '';
  public source?: DynamicLayer = new DynamicLayer();
  public renderer?: any = {};
  public labelingInfo?: any = {};
  public popupTemplate?: PopupTemplate = new PopupTemplate();
}

export interface EsriMapTheme {
  id: string;
  title?: string;
}
