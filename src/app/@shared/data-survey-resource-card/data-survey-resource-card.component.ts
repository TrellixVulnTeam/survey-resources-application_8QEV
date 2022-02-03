import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { SurveyResourcesCard, ISurveyResourcesCard } from '@app/@core/data/models/isurveyresources';

@Component({
  selector: 'app-data-survey-resource-card',
  templateUrl: './data-survey-resource-card.component.html',
  styleUrls: ['./data-survey-resource-card.component.scss'],
})
export class DataSurveyResourceCardComponent implements OnInit {
  @Input() data!: SurveyResourcesCard[];
  selected = false;
  view = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event: Event) => {
      //subscribe to the router then everytime the pin changes in the URL path - fetch the modiv data
      if (event instanceof NavigationEnd) {
        route.params.subscribe((params = {}) => {
          let URL = this.router.url;
          let URL_AS_LIST = URL.split('/');
          this.view = URL_AS_LIST[3] || '';
        });
      }
    });
  }

  ngOnInit(): void {}

  selectRecord(pin: string) {
    console.log(`selectRecord:pin: ${pin}`);
  }
  selectPIN(index: number, Oid: number, pin: string) {
    console.log(`selectPIN:pin: ${pin}`);
  }
}
