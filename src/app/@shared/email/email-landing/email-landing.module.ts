import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailLandingComponent } from './email-landing.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [EmailLandingComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: EmailLandingComponent }]), MatListModule],
})
export class EmailLandingModule {}
