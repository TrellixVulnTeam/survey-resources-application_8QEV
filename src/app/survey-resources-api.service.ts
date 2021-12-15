import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SurveyResourcesApiService {
  private url = 'https://localhost:44311/api/SurveyResources/PresentName?PresentName=';

  constructor(private http: HttpClient) {}

  getPosts(presentName: string = 'Patriots Path') {
    this.url = this.url + presentName;
    var headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers, observe: 'response' });
  }
}
