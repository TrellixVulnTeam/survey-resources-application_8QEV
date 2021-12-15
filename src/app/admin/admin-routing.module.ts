import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthenticationGuard } from '@app/auth';
import { AdminComponent } from './admin/admin.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { LkpTableManagementComponent } from './lkp-table-management/lkp-table-management.component';
import { EmailManagementComponent } from './email-management/email-management.component';
import { EsriMapManagementComponent } from './esri-map-management/esri-map-management.component';
import { DocumentManagementComponent } from './document-management/document-management.component';
const routes: Routes = [
  { path: '', component: AdminComponent, data: { title: marker('Admin') }, canActivate: [AuthenticationGuard] },
  {
    path: 'users',
    component: UserManagementComponent,
    data: { title: marker('Users') },
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'documents',
    component: DocumentManagementComponent,
    data: { title: marker('Document Management') },
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'dictionaries',
    component: LkpTableManagementComponent,
    data: { title: marker('Lookup Table Definitions') },
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'email',
    component: EmailManagementComponent,
    data: { title: marker('Email') },
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@shared/email/email-landing/email-landing.module').then((m) => m.EmailLandingModule),
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@shared/email/email-template-form/email-template-form.module').then((m) => m.EmailTemplateFormModule),
        canActivate: [AuthenticationGuard],
      },
      {
        path: ':id',
        canActivate: [AuthenticationGuard],
        children: [
          {
            path: '',
            redirectTo: 'preview',
          },
          {
            path: 'preview',
            loadChildren: () =>
              import('@shared/email/email-preview/email-preview.module').then((m) => m.EmailPreviewModule),
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'edit',
            loadChildren: () =>
              import('@shared/email/email-template-form/email-template-form.module').then(
                (m) => m.EmailTemplateFormModule
              ),
            canActivate: [AuthenticationGuard],
          },
        ],
      },
    ],
  },
  {},

  {
    path: 'arcgis-config',
    component: EsriMapManagementComponent,
    data: { title: marker('Map') },
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
