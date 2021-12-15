import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenMapComponent } from './full-screen-map.component';

describe('FullScreenMapComponent', () => {
  let component: FullScreenMapComponent;
  let fixture: ComponentFixture<FullScreenMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullScreenMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
