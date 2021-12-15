export interface AgencyType {
  agencyTypeId: number;
  agencyType: string;
}

export interface Agency {
  fullName: string;
  email: string;
  password: string;
  role: string;
  agencyId: number;
  agencyType: string;
  agencyName: string;
  agencyLabel: string;
  agencyAbbreviation: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  zipcode: string;
  primaryTelephone: string;
  website: string;
  logo: string;
  isActive: boolean;
}

export interface EntityType {
  entityTypeId: number;
  entityType: string;
}

export interface Entity {
  entityId: number;
  entityName: string;
  entityType: number;
  agencyType: string;
}

export interface Affiliation {
  entityId: number;
  entityName: string;
  title: string;
  isActive: boolean;
}

export interface AgencyEntity {
  agencyEntityId: number;
  agencyId: number;
  agencyType: string;
  agencyName: string;
  agencyLabel: string;
  agencyAbbreviation: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  zipcode: string;
  primaryTelephone: string;
  website: string;
  logo: string;
  isActive: string;
  entityType: string;
  entityTypeID: string;
  entityName: string;
}
