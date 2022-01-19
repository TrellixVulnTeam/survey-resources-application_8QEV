import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { EsriMapModule, ESRI_MAP_CONFIG } from 'esri-map';

const mapConfig = {
  mapServiceUrl:
    'https://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/ParcelSearcher/ParcelSearcher_Dynamic/MapServer',
  nearmapKey: '',
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
  imports: [CommonModule, TranslateModule, SharedModule, FlexLayoutModule, MaterialModule, HomeRoutingModule, EsriMapModule],
  declarations: [HomeComponent],
  providers: [
    {
      provide: ESRI_MAP_CONFIG,
      useValue: mapConfig,
    },
  ],
})
export class HomeModule {}
