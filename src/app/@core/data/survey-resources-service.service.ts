import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISurveyResourcesCard, SurveyResourcesCard, ISurveyResourcesDetail } from './models/isurveyresources';
import { environment } from '@env/environment';
import { StoreServiceService } from '@core/data/store-service.service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyResourcesServiceService extends StoreServiceService<SurveyResourcesCard> {
  constructor(protected http: HttpClient) {
    super(http, {
      url: environment.surveyResourcesApi + '/PresentName',
      idField: 'SurveyID',
      itemName: 'SurveyResourcesCard',
    });
  }

  getDetail(id: string): Observable<ISurveyResourcesDetail> {
    const url = this.settings.url;
    return this.http.get<ISurveyResourcesDetail>(`${this.settings.url}${id}`).pipe(
      catchError((e) => {
        this.getError = e;
        return throwError(`Error loading ${this.settings.itemName}`);
      })
    );
  }
}
