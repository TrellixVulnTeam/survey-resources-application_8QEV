import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { EmailTemplateFormComponent } from './email-template-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EmailTemplateFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: EmailTemplateFormComponent }]),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [EmailTemplateFormComponent],
})
export class EmailTemplateFormModule {}
