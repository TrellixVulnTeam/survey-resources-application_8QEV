import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSurveyResourceCardComponent } from './data-survey-resource-card.component';

describe('DataSurveyResourceCardComponent', () => {
  let component: DataSurveyResourceCardComponent;
  let fixture: ComponentFixture<DataSurveyResourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSurveyResourceCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSurveyResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
