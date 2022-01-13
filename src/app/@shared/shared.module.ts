import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
//import { EsriMapComponent } from './esri-map/esri-map.component';
//import { EmailMessageComponent } from './email/email-message/email-message.component';
import { BlobUploadComponent } from './azure-storage/blob-upload/blob-upload.component';
import { SearchInputComponent } from './search/search-input/search-input.component';
import { DataContainerComponent } from './data-container/data-container.component';
import { DataFilterComponent } from './data-filter/data-filter.component';
import { DataBreadcrumbsComponent } from './data-breadcrumbs/data-breadcrumbs.component';
import { DataResultsComponent } from './data-results/data-results.component';

//import { EmailTemplateCardComponent } from './email/email-template-card/email-template-card.component';
//import { EmailTemplateFormComponent } from './email/email-template-form/email-template-form.component';
//import { EmailLandingComponent } from './email/email-landing/email-landing.component';
//import { EmailPreviewComponent } from './email/email-preview/email-preview.component';
@NgModule({
  imports: [FlexLayoutModule, FormsModule, ReactiveFormsModule, MaterialModule, CommonModule, RouterModule],
  declarations: [
    LoaderComponent,
    //EsriMapComponent,
    //  EmailMessageComponent,
    BlobUploadComponent,
    SearchInputComponent,
    DataContainerComponent,
    DataFilterComponent,
    DataBreadcrumbsComponent,
    DataResultsComponent,

    // EmailTemplateCardComponent,
    //  EmailTemplateFormComponent,
    //  EmailLandingComponent,
    // EmailPreviewComponent,
  ],
  exports: [
    LoaderComponent,
    //EsriMapComponent,
    // EmailMessageComponent,
    BlobUploadComponent,
    //  EmailTemplateCardComponent,
    //  EmailTemplateFormComponent,
    DataContainerComponent,
  ],
})
export class SharedModule {}
