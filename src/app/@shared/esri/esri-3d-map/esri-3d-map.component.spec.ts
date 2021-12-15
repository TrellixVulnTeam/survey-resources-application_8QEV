import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esri3DMapComponent } from './esri-3d-map.component';

describe('Esri3DMapComponent', () => {
  let component: Esri3DMapComponent;
  let fixture: ComponentFixture<Esri3DMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Esri3DMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Esri3DMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
