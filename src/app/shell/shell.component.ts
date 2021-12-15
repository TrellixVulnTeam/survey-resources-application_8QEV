import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { AuthService, CredentialsService } from '@app/auth';
import { TabItem } from '@app/@core/data/models/tab-item';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['../app.component.scss', './shell.component.scss'],
})
export class ShellComponent implements OnInit {
  sidenavWidth = 12;

  tabs: TabItem[] = [
    {
      label: 'HOME',
      icon: 'home',
      route: ['/home'],
    },
    {
      label: 'TAX RECORDS',
      icon: 'title',
      route: ['/tax-records'],
    },
    {
      label: 'SR1As',
      icon: 'monetization_on',
      route: ['/sr1as'],
    },
    {
      label: 'APPEALS',
      icon: 'waves',
      route: ['/appeals'],
    },
    {
      label: 'TAX MAPS',
      icon: 'map',
      route: ['/tax-maps'],
    },
  ];
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthService,
    private credentialsService: CredentialsService,
    private media: MediaObserver
  ) {}

  ngOnInit() {}

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
  increase() {
    this.sidenavWidth = 15;
    console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 4;
    console.log('decrease sidenav width');
  }
}
