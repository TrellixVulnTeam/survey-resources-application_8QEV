export interface ISurveyResourcesCard {
  SurveyID: number;
  ResourceType: string;
  SurveySource: string;
  SurveyCoordinateSystem: string;
  SurveyTitle: string;
  PresentName: string;
  AliasNames: string;
  SurveyDate: Date;
  // primaryMuniID: number;
  // SurveySiteGeneralAddress: string;
  // SurveyDescription: string;
  // isPublicLandholderInterest: boolean;
  // CoClerkFileNumber: number;
  // CoClerkBookNumber: number;
  // CoClerkPageNumber: number;
  // DevReviewNumber: number;
  // POSI_UNIT_ID: number;
  // GreenAcresSurveyID: number;
  // otherSurveyID: number;
  // OSTF_ProjectID: number;
  // orig_SurveyID: number;
  // Comment: string;
  // MetaCreationDateTime: Date;
  // hasValidSurveyDocument: boolean;
  // hasValidBaseSurvey: boolean;
  // hasValidSurveyParcelsLink: boolean;
  // hasValidLandholderInterests: boolean;
  // BaseMapUpdateStatus: string;
  // NoParcelSurvey: boolean;
  // COGOReport: string;
  // LastEditor: string;
  // LastEditDate: Date;
  // testTimeStamp: Date
  // newFilename: string;
}

export class SurveyResourcesCard implements ISurveyResourcesCard {
  constructor(
    public SurveyID: number,
    public ResourceType: string,
    public SurveySource: string,
    public SurveyCoordinateSystem: string,
    public SurveyTitle: string,
    public PresentName: string,
    public AliasNames: string,
    public SurveyDate: Date
  ) {}
}

export interface ISurveyResourcesDetail extends ISurveyResourcesCard {
  NetTaxableValue: number;
}
