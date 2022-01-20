import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { TabItem } from '@app/@core/data/models/tab-item';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  sideNavWidth = 12;

  tabs: TabItem[] = [
    {
      label: 'HOME',
      icon: 'home',
      route: ['/home'],
    },
    {
      label: 'SURVEY RESOURCES',
      icon: 'info',
      route: ['/about'],
    },
    {
      label: 'MAPS',
      icon: 'explore',
      route: ['/map'],
    },
    {
      label: 'ADMIN',
      icon: 'widgets',
      route: ['/admin'],
    },
    {
      label: 'TEST',
      icon: 'public',
      route: ['/test'],
    },
  ];
  constructor(
    private router: Router,
    private titleService: Title,

    private media: MediaObserver
  ) {}

  ngOnInit() {}

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  increase() {
    this.sideNavWidth = 15;
    console.log('increase sidenav width');
  }

  decrease() {
    this.sideNavWidth = 4;
    console.log('decrease sidenav width');
  }
}
