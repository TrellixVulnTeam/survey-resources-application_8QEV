import { NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { EsriMapModule, ESRI_MAP_CONFIG } from 'esri-map';

const mapConfig = {
  mapServiceUrl: 'https://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/Surveys/SurveyResources/MapServer',
  parcelLayerUrl:
    'https://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/ParcelSearcher/ParcelsWGS84_10dot5/MapServer/0',
  nearmapKey: 'MWFkNGYyOWYtN2JkNS00ZWIzLWFlNDctNTdiODU5ZWE0ZGM0',
  baseMaps: ['topo-vector', 'hybrid'],
  wkid: 102100,
  sublayerConfig: [
    { id: 8, title: 'Base Surveys', opacity: 0.75, visible: true, legendEnabled: true, listMode: 'show' },
    { id: 7, name: 'Unsurveyed Parcels', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 6, title: 'Parcels', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 5, title: 'Easements', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 4, title: 'Structures', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 3, title: 'Base Map Auxiliary', visible: true, legendEnabled: false, listMode: 'hide' },
    { id: 2, title: 'Base Map', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 1, title: 'Monuments', visible: true, legendEnabled: true, listMode: 'show' },
    { id: 0, title: 'Municipalities', parentLayerId: -1, visible: true, legendEnabled: false, listMode: 'hide' },
  ],
  searchTargets: [
    {
      featureName: 'surveyResources.application',
      url: 'https://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/Surveys/SurveyResources/MapServer/8',
      // searchField: "Id"
    },
  ],
  selectSymbol: {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    color: 'red',
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [128, 128, 128, 0.5],
      width: '0.5px',
    },
  },
};

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule,
    EsriMapModule,
  ],
  declarations: [HomeComponent],
  providers: [
    {
      provide: ESRI_MAP_CONFIG,
      useValue: mapConfig,
    },
  ],
})
export class HomeModule {}
