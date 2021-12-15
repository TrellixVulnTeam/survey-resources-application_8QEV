import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { Esri3DMapComponent } from './esri-3d-map/esri-3d-map.component';

@NgModule({
  declarations: [EsriMapComponent, Esri3DMapComponent],
  imports: [CommonModule],
  exports: [EsriMapComponent, Esri3DMapComponent],
})
export class EsriMapModule {}
