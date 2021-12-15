import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkpTableManagementComponent } from './lkp-table-management.component';

describe('LkpTableManagementComponent', () => {
  let component: LkpTableManagementComponent;
  let fixture: ComponentFixture<LkpTableManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LkpTableManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkpTableManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
