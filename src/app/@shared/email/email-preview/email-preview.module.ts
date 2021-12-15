import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailPreviewComponent } from './email-preview.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [EmailPreviewComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: EmailPreviewComponent }]), MatListModule],
})
export class EmailPreviewModule {}
