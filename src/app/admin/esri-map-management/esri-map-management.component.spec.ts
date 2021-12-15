import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriMapManagementComponent } from './esri-map-management.component';

describe('EsriMapManagementComponent', () => {
  let component: EsriMapManagementComponent;
  let fixture: ComponentFixture<EsriMapManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsriMapManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriMapManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
