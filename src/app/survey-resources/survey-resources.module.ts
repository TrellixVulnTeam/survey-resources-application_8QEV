import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyResourcesRoutingModule } from './survey-resources-routing.module';
import { SurveysComponent } from './surveys/surveys.component';

@NgModule({
  declarations: [SurveysComponent],
  imports: [CommonModule, SurveyResourcesRoutingModule],
})
export class SurveyResourcesModule {}
