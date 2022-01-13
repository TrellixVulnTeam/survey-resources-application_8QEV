import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, AboutRoutingModule, SharedModule],
  declarations: [AboutComponent],
})
export class AboutModule {}
