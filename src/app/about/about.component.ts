import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { SurveyResourcesApiService } from '@app/survey-resources-api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  version: string | null = environment.version;
  posts: any;

  constructor(private surveyResourceService: SurveyResourcesApiService) {}

  ngOnInit() {
    this.surveyResourceService.getPosts().subscribe(
      (response) => {
        this.posts = response.body;
        console.log(response.body);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
