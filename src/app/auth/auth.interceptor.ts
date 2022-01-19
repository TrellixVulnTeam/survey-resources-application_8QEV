import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string;
  constructor(public oidcSecurityService: OidcSecurityService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.authService.token.subscribe(res => {
    // console.log(res);
    // alert(res)
    this.token = this.oidcSecurityService.getAccessToken();
    // });
    const headers = req.headers
      //    .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Accept', 'text/plain')
      // .set('Origin',location.origin)
      .set('Authorization', `Bearer ${this.token}`);
    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}
