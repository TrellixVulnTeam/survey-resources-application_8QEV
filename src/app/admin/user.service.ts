import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApplicationUser, UserAffiliaion, UserClaimCRUD, UserRoleCRUD, UserRolesAndClaims } from './iuser';
import { Agency, AgencyType, AgencyEntity, Entity, EntityType } from './iagency';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = `${environment.morrisIdentityApiUrl}`;
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', location.origin);
  //.set('Origin',location.origin);

  //Access-Control-Allow-Origin: https://developer.mozilla.org
  constructor(private http: HttpClient) {}

  addUser(user: UserRolesAndClaims): Observable<UserRolesAndClaims> {
    let API_URL = `${this.apiUrl}/UserAdmin`;
    return this.http.post<UserRolesAndClaims>(API_URL, user, { headers: this.headers }).pipe(catchError(this.error));
  }

  assignUserRole(userole: UserRoleCRUD): Observable<UserRolesAndClaims> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    return this.http.post<UserRolesAndClaims>(API_URL, userole, { headers: this.headers }).pipe(catchError(this.error));
  }

  updateUserRole(userole: UserRoleCRUD): Observable<UserRolesAndClaims> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    return this.http.put<UserRolesAndClaims>(API_URL, userole, { headers: this.headers }).pipe(catchError(this.error));
  }
  deleteUserRole(userrole: UserRoleCRUD): Observable<any> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    const options = {
      headers: this.headers,
      body: userrole,
    };
    return this.http.delete(API_URL, options).pipe(catchError(this.error));
  }

  assignUserClaim(userclaim: UserClaimCRUD): Observable<UserRolesAndClaims> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    return this.http
      .post<UserRolesAndClaims>(API_URL, userclaim, { headers: this.headers })
      .pipe(catchError(this.error));
  }

  updateUserClaim(userclaim: UserClaimCRUD): Observable<UserRolesAndClaims> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    return this.http
      .put<UserRolesAndClaims>(API_URL, userclaim, { headers: this.headers })
      .pipe(catchError(this.error));
  }
  deleteUserClaim(userclaim: UserClaimCRUD): Observable<any> {
    let API_URL = `${this.apiUrl}/UserAdmin/user-role`;
    const options = {
      headers: this.headers,
      body: userclaim,
    };
    return this.http.delete(API_URL, options).pipe(catchError(this.error));
  }

  // Agency Endpoints
  //______________________________________
  // Read
  showAgencyTypes(): Observable<HttpResponse<AgencyType[]>> {
    let API_URL = `${this.apiUrl}/Agencies/agency-types`;

    return this.http.get<AgencyType[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  // Read
  showEntityTypes(): Observable<HttpResponse<EntityType[]>> {
    let API_URL = `${this.apiUrl}/Agencies/entity-types`;

    return this.http.get<EntityType[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  // Read
  showOSTFAgencies(): Observable<HttpResponse<AgencyEntity[]>> {
    let API_URL = `${this.apiUrl}/Agencies/ostf`;

    return this.http.get<AgencyEntity[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  // Read
  showEntities(): Observable<HttpResponse<Entity[]>> {
    let API_URL = `${this.apiUrl}/Agencies/entities`;

    return this.http.get<Entity[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  // Read
  showAgencies(): Observable<HttpResponse<Agency[]>> {
    let API_URL = `${this.apiUrl}/Agencies`;
    return this.http.get<Agency[]>(API_URL, { headers: this.headers, observe: 'response' });
  }

  // User Endpoints
  //______________________________________

  // Read
  showMyClaims() {
    let API_URL = `${this.apiUrl}/ApplicationUserClaims/loggedinUserClaims`;
    return this.http.get(API_URL, { headers: this.headers });
  }

  // Read
  showMyApplicationClaims() {
    let API_URL = `${this.apiUrl}/ApplicationUserClaims/applicationClaims`;
    return this.http.get(API_URL, { headers: this.headers });
  }
  // Read
  showMyApplicationUsers(): Observable<HttpResponse<UserRolesAndClaims[]>> {
    let API_URL = `${this.apiUrl}/UserAdmin/GetClientUsers`;

    // let API_URL = agency `${this.apiUrl}/UserAdmin/users/pres-trust/${program}/${agency}`;
    return this.http.get<UserRolesAndClaims[]>(API_URL, {
      headers: this.headers,
      observe: 'response',
    });
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
