import { Affiliation } from './iagency';

export interface Claim {
  claimType: string;
  claimValue: any;
}

export interface multiTenantClaim {
  claimType: string;
  claimValues: any[];
}

export interface ApplicationUser {
  UserId: string;
  UserName: string;
  NormalizedUserName: string;
  Email: string;
  NormalizedEmail: string;
  EmailConfirmed: string;
  PasswordHash: string;
  SecurityStamp: string;
  ConcurrencyStamp: string;
  PhoneNumber: string;
  PhoneNumberConfirmed: string;
  TwoFactorEnabled: string;
  LockoutEnd: string;
  LockoutEnabled: string;
  AccessFailedCount: string;
  Title: string;
  IsEnabled: string;
}

export interface UserRolesAndClaims {
  userId?: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  title?: string;
  isEnabled?: boolean;
  affiliations?: Affiliation[];
  claims?: Claim[];
  roles?: string[];
}

export interface IPresTrustProgram {
  id: string;
  name: string;
  disabled: boolean;
}

export interface UserAffiliaion {
  UserAffiliationId: number;
  userId: string;
  agencyId: number;
  entityName: string;
  title?: string;
  isActive: Boolean;
}

export interface UserClaim {
  id: number;
  userId: string;
  claimType: string;
  claimValue: any;
}

export interface UserRole {
  roleId: number;
  userId: number;
}
export interface UserClaimCRUD {
  email: string;
  claim: Claim;
  newClaim?: Claim;
}

export interface UserRoleCRUD {
  email: string;
  role: string;
  newRole?: string;
}

export interface ClientRolesandClaims {
  ClientID: string;
  Role: string;
  ClaimTpe: string;
  ClaimValues: [];
}

export interface AgencyRoles {
  agencyid: number;
  claimTypes: string[];
}

export interface multiTenantProfile {
  tenant: string;
  claims: multiTenantClaim[];
  agencyroles: AgencyRoles[];
}
