import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBreadcrumbsComponent } from './data-breadcrumbs.component';

describe('DataBreadcrumbsComponent', () => {
  let component: DataBreadcrumbsComponent;
  let fixture: ComponentFixture<DataBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataBreadcrumbsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
