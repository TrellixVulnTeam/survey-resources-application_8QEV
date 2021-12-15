import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter, OnDestroy } from '@angular/core';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';

import Expand from '@arcgis/core/widgets/Expand';
import UI from '@arcgis/core/views/ui/UI';
import * as PromiseUtils from '@arcgis/core/core/PromiseUtils';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Symbol from '@arcgis/core/symbols/Symbol';
import * as cimSymbolUtils from '@arcgis/core/symbols/support/cimSymbolUtils';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Directions from '@arcgis/core/widgets/Directions';
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D';
import MapProperties from '@arcgis/core/WebMap';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import Home from '@arcgis/core/widgets/Home';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Locate from '@arcgis/core/widgets/Locate';
import Measurement from '@arcgis/core/widgets/Measurement';
import Popup from '@arcgis/core/widgets/Popup';
import Zoom from '@arcgis/core/widgets/Zoom';
import Attribution from '@arcgis/core/widgets/Attribution';
import Print from '@arcgis/core/widgets/Print';
import Track from '@arcgis/core/widgets/Track';
import Query from '@arcgis/core/tasks/support/Query';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import config from '@arcgis/core/config.js';
import { Extent, SpatialReference } from '@arcgis/core/geometry';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.scss'],
})
export class EsriMapComponent implements OnInit, OnDestroy {
  public view: any = null;
  mapSize: string = 'thumbnail';
  fullScreen: boolean = false;
  private _zoom = 15;
  private _center: Array<number> = [-74.5, 40.8];
  private _basemap = 'streets';
  private _loaded = false;
  //  private _view: esri.MapView = null;
  private _height = '100%';
  private _width = '100%';
  private _extent: Array<number> = [-8337000, 4960000, -8263000, 5023000];

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Input()
  set extent(extent: Array<number>) {
    this._extent = extent;
  }
  get extent(): Array<number> {
    return this._extent;
  }

  @Input()
  set width(width: string) {
    this._width = width;
    this.mapViewEl.nativeElement.style.width = this._width;
  }
  get width(): string {
    return this._width;
  }

  @Input()
  set height(height: string) {
    this._height = height;
    this.mapViewEl.nativeElement.style.height = this._height;
  }
  get height(): string {
    return this._height;
  }

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
  @ViewChild('mapToolbar', { static: true }) private mapToolbar: ElementRef;

  initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    // Configure the Map
    var basemap = Basemap.fromId(this._basemap);

    const webmap = new WebMap({
      basemap: basemap,
    });

    const view = new MapView({
      container,
      map: webmap,
      center: this._center,
      zoom: this._zoom,
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    const bkExpand = new Expand({
      view,
      content: bookmarks,
      expanded: true,
    });

    const fullScreen = new Fullscreen({
      view,
    });

    const legend = new Legend({
      view,
    });

    var basemapToggle = new BasemapToggle({
      view,
      nextBasemap: 'satellite',
    });

    var layerList = new LayerList({
      view,
    });

    const municipalities = new FeatureLayer({
      url: 'http://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/General/MunicipalBoundary/MapServer/0',
      minScale: 100000000,
    });

    const MUAproperties = new FeatureLayer({
      url: 'http://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/MCMUA/MCMUAFeatures/MapServer/4',
      popupTemplate: {
        title: '{ProjectPartName}',
        content: 'This property is {ProjectPartStatus}',
      },
    });

    webmap.add(municipalities);
    webmap.add(MUAproperties);

    var coordsWidget = document.createElement('div');
    coordsWidget.id = 'coordsWidget';
    coordsWidget.className = 'esri-widget esri-component';
    coordsWidget.style.padding = '7px 15px 5px';

    function showCoordinates(pt: __esri.Point) {
      var coords =
        'Lat/Lon ' +
        pt.latitude.toFixed(3) +
        ' ' +
        pt.longitude.toFixed(3) +
        ' | Scale 1:' +
        Math.round(view.scale * 1) / 1 +
        ' | Zoom ' +
        view.zoom;
      coordsWidget.innerHTML = coords;
    }

    view.watch('stationary', function (isStationary) {
      showCoordinates(view.center);
    });

    view.on('pointer-move', function (evt) {
      showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });

    // Add the widget to the top-right corner of the view
    view.ui.add(bkExpand, 'top-right');
    view.ui.add(layerList, 'bottom-right');
    view.ui.add(legend, 'bottom-left');
    view.ui.add(fullScreen, 'top-left');
    view.ui.add(basemapToggle, 'top-left');
    view.ui.add(coordsWidget, 'bottom-right');

    // bonus - how many bookmarks in the webmap?
    webmap.when(() => {
      if (webmap.bookmarks && webmap.bookmarks.length) {
        console.log('Bookmarks: ', webmap.bookmarks.length);
      } else {
        console.log('No bookmarks in this webmap.');
      }
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      this._loaded = this.view.ready;
      console.log('The map is ready.');
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
