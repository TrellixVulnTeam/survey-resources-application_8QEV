import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { FullScreenMapComponent } from './full-screen-map/full-screen-map.component';
import { MapSceneComponent } from './map-scene/map-scene.component';
const routes: Routes = [
  { path: '', redirectTo: 'fullscreen' },
  { path: 'fullscreen', component: FullScreenMapComponent, data: { title: marker('Map') } },
  { path: 'scene', component: MapSceneComponent, data: { title: marker('Map') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
