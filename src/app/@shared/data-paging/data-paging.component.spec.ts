import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPagingComponent } from './data-paging.component';

describe('DataPagingComponent', () => {
  let component: DataPagingComponent;
  let fixture: ComponentFixture<DataPagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataPagingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
