import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataResultsComponent } from './data-results.component';

describe('DataResultsComponent', () => {
  let component: DataResultsComponent;
  let fixture: ComponentFixture<DataResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
