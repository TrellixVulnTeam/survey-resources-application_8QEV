import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSceneComponent } from './map-scene.component';

describe('MapSceneComponent', () => {
  let component: MapSceneComponent;
  let fixture: ComponentFixture<MapSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSceneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
