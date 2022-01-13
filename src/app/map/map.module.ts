import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { FullScreenMapComponent } from './full-screen-map/full-screen-map.component';
import { MapSceneComponent } from './map-scene/map-scene.component';
import { EsriMapModule, ESRI_MAP_CONFIG } from 'esri-map';
//import { EsriMapComponent } from '@shared/esri/esri-map/esri-map.component';
//import {Esri3DMapComponent } from '@shared/esri/esri-3d-map/esri-3d-map.component'
const mapConfig = {
  mapServiceUrl:
    'https://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/ParcelSearcher/ParcelSearcher_Dynamic/MapServer',
  baseMaps: ['topo-vector', 'hybrid'],
  sublayerConfig: [
    {
      id: 4,
      title: 'Recent Sales',
      visible: true,
      legendEnabled: true,
      listMode: 'show',
    },
    {
      id: 7,
      title: 'Parcels',
      visible: true,
      legendEnabled: true,
      listMode: 'show',
    },

    {
      id: 14,
      title: 'Municipalities',
      visible: true,
      legendEnabled: false,
      listMode: 'hide',
    },
  ],
};

@NgModule({
  declarations: [FullScreenMapComponent, MapSceneComponent],
  imports: [CommonModule, MapRoutingModule, EsriMapModule],
  providers: [
    {
      provide: ESRI_MAP_CONFIG,
      useValue: mapConfig,
    },
  ],
})
export class MapModule {}
