import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { FlexModule } from '@angular/flex-layout';
import { SharedModule } from '@shared';

import { AdminRoutingModule } from './admin-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { DocumentManagementComponent } from './document-management/document-management.component';
import { EmailManagementComponent } from './email-management/email-management.component';
import { LkpTableManagementComponent } from './lkp-table-management/lkp-table-management.component';
import { EsriMapManagementComponent } from './esri-map-management/esri-map-management.component';
import { AdminComponent } from './admin/admin.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserInviteComponent } from './user-invite/user-invite.component';
import { EmailTemplateCardModule } from '@shared/email/email-template-card/email-template-card.module';
import { EmailTemplateFormModule } from '@app/@shared/email/email-template-form/email-template-form.module';
//import { EmailTemplateCardComponent } from '@app/@shared/email/email-template-card/email-template-card.component';
@NgModule({
  declarations: [
    UserManagementComponent,
    DocumentManagementComponent,
    EmailManagementComponent,
    LkpTableManagementComponent,
    EsriMapManagementComponent,
    AdminComponent,
    UserEditComponent,
    UserInviteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MaterialModule,
    FlexModule,
    SharedModule,
    EmailTemplateCardModule,
    EmailTemplateFormModule,
  ],
})
export class AdminModule {}
