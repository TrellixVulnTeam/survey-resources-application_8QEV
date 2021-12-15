import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsriMapModule } from '@shared/esri/esri-map.module';
import { MapRoutingModule } from './map-routing.module';
import { FullScreenMapComponent } from './full-screen-map/full-screen-map.component';
import { MapSceneComponent } from './map-scene/map-scene.component';
//import { EsriMapComponent } from '@shared/esri/esri-map/esri-map.component';
//import {Esri3DMapComponent } from '@shared/esri/esri-3d-map/esri-3d-map.component'

@NgModule({
  declarations: [FullScreenMapComponent, MapSceneComponent],
  imports: [CommonModule, MapRoutingModule, EsriMapModule],
})
export class MapModule {}
