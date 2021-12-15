import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

//import esri = __esri; // Esri TypeScript Types

@Component({
  selector: 'app-full-screen-map',
  templateUrl: './full-screen-map.component.html',
  styleUrls: ['./full-screen-map.component.scss'],
})
export class FullScreenMapComponent implements OnInit {
  // @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  // @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = 'streets';
  private _loaded = false;
  //  private _view: esri.MapView = null;
  private _height = '100%';
  private _width = '100%';
  private _extent: Array<number> = [-8337000, 4960000, -8263000, 5023000];

  get mapLoaded(): boolean {
    return this._loaded;
  }

  // @Input()
  // set zoom(zoom: number) {
  //   this._zoom = zoom;
  // }

  // get zoom(): number {
  //   return this._zoom;
  // }

  // @Input()
  // set center(center: Array<number>) {
  //   this._center = center;
  // }

  // get center(): Array<number> {
  //   return this._center;
  // }

  // @Input()
  // set basemap(basemap: string) {
  //   this._basemap = basemap;
  // }

  // get basemap(): string {
  //   return this._basemap;
  // }

  // @Input()
  // set extent(extent: Array<number>) {
  //   this._extent = extent;
  // }
  // get extent(): Array<number> {
  //   return this._extent;
  // }

  // @Input()
  // set width(width: string) {
  //   this._width = width;
  //   this.mapViewEl.nativeElement.style.width = this._width;
  // }
  // get width(): string {
  //   return this._width;
  // }

  // @Input()
  // set height(height: string) {
  //   this._height = height;
  //   this.mapViewEl.nativeElement.style.height = this._height;
  // }
  // get height(): string {
  //   return this._height;
  // }

  constructor() {}

  // async initializeMap() {
  //   try {
  //     // Load the modules for the ArcGIS API for JavaScript
  //     const [EsriMap, EsriMapView] = await loadModules(['esri/Map', 'esri/views/MapView']);

  //     // Configure the Map
  //     const mapProperties: esri.MapProperties = {
  //       basemap: this._basemap,
  //     };

  //     const map: esri.Map = new EsriMap(mapProperties);

  //     // Initialize the MapView
  //     const mapViewProperties: esri.MapViewProperties = {
  //       container: this.mapViewEl.nativeElement,
  //       center: [-74.5, 40.8],
  //       zoom: 13,
  //       map: map,
  //     };

  //     this._view = new EsriMapView(mapViewProperties);
  //     await this._view.when();
  //     return this._view;
  //   } catch (error) {
  //     console.log('EsriLoader: ', error);
  //   }
  // }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    // this.initializeMap().then((mapView) => {
    //   // The map has been initialized
    //   console.log('mapView ready: ', this._view.ready);
    //   this._loaded = this._view.ready;
    //   this.mapLoadedEvent.emit(true);
    // });
  }

  // ngOnDestroy() {
  //   if (this._view) {
  //     // destroy the map view
  //     this._view.container = null;
  //   }
  // }
}
