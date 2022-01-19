import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../app.component.scss', './header.component.scss'],
})
export class HeaderComponent implements OnInit {
  configuration$: OpenIdConfiguration;
  // userDataChanged$: Observable<OidcClientNotification<any>>;
   userData$: Observable<UserDataResult>;
   isAuthenticated = false;
   email$:string = "";
   userName$:string = "";
  
  constructor(
    public oidcSecurityService: OidcSecurityService,
    private router: Router,
    private titleService: Title,
    private media: MediaObserver
  ) {
    this.configuration$ = this.oidcSecurityService.getConfiguration();
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      console.warn('authenticated: ', isAuthenticated);
    });
    this.userData$ = this.oidcSecurityService.userData$;
    
    this.userData$.subscribe((ud)=>{
    
      this.email$ =  ud.userData["email"] || "";
      this.userName$ =  ud.userData["userName"] || "";

  });
  }

  ngOnInit(): void {}

  login() {
    this.oidcSecurityService.authorize();
  }

  refreshSession() {
    this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.log(result));
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  logoffAndRevokeTokens() {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
  }

  revokeRefreshToken() {
    this.oidcSecurityService.revokeRefreshToken().subscribe((result) => console.log(result));
  }

  revokeAccessToken() {
    this.oidcSecurityService.revokeAccessToken().subscribe((result) => console.log(result));
  }


  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
  // increase() {
  //   this.sidenavWidth = 15;
  //   console.log('increase sidenav width');
  // }
  // decrease() {
  //   this.sidenavWidth = 4;
  //   console.log('decrease sidenav width');
  // }
}
