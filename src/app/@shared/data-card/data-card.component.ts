import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { ISurveyResourcesCard } from '@app/@core/data/models/isurveyresources';

@Component({
  selector: 'app-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['../data-container/data-container.component.scss', './data-card.component.scss'],
})
export class DataCardComponent implements OnInit {
  @Input() public vtemplate: ISurveyResourcesCard = {
    SurveyID: 1,
    ResourceType: 'Map',
    SurveySource: 'FiledMap',
    SurveyCoordinateSystem: 'None',
    SurveyTitle: 'FOSTER FIELDS',
    PresentName: 'Cedar Lake Park',
    AliasNames: 'Cedar Lake Park',
    SurveyDate: '1901-01-01',
  };
  @Output() selectTemplateEvent = new EventEmitter<number>();
  selected = false;

  selectRecord(id: string) {
    console.log(`selectRecord: ${id}`);
  }
  constructor() {}

  ngOnInit(): void {}
}
