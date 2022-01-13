import { Injectable } from '@angular/core';
import { Observable, pipe, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

//import { stringify } from 'querystring';

import { EmailMessage, EmailResponse, EmailTemplate, vwEmailTemplate } from './imessage';
import { environment } from 'src/environments/environment';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { AuthService, CredentialsService } from '@app/auth';

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateConfigService {
  apiUrl: string = environment.morrisClientApiUrl;
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', location.origin);
  //clientId:string = environment.clientId;
  isAuthorized: boolean = false;
  userData: any = null;

  constructor(private http: HttpClient, private authenticationService: AuthService) {
    this.authenticationService.userData.subscribe((data) => {
      this.userData = data;
    });
    this.authenticationService.isLoggedIn.subscribe((b) => {
      this.isAuthorized = b;
    });

    if (this.isAuthorized) {
      this.getTemplates(this.clientId);
    }
  }

  get userEmail(): string | null {
    return this.userData ? this.userData.email : null;
  }
  get clientId(): string | null {
    return this.userData ? this.userData.clientId : null;
  }

  getTemplates(clientid: string): Observable<HttpResponse<vwEmailTemplate[]>> {
    let API_URL = `${this.apiUrl}/EmailTemplates/client/${clientid}`;
    return this.http.get<vwEmailTemplate[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  getTemplate(id: number): Observable<EmailTemplate> {
    const API_URL = `${this.apiUrl}/EmailTemplates/${id}`;
    return this.http.get<EmailTemplate>(API_URL, { headers: this.headers }).pipe(
      tap((_) => console.log(`fetched template id=${id}`)),
      catchError(this.handleError<EmailTemplate>(`getTemplate id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //  this.messageService.add(`HeroService: ${message}`);
  }

  //insertTemplate(template:EmailTemplate){}

  //updateTemplate(template:EmailTemplate){}

  //deleteTemplate(id:number){}
}
