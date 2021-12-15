import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateCardComponent } from './email-template-card.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [EmailTemplateCardComponent],
  exports: [EmailTemplateCardComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: EmailTemplateCardComponent }]), MaterialModule],
})
export class EmailTemplateCardModule {}
