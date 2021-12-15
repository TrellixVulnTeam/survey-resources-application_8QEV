import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter, OnDestroy } from '@angular/core';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import WebScene from '@arcgis/core/WebScene';

import Slide from '@arcgis/core/webscene/Slide';
import SceneView from '@arcgis/core/views/SceneView';
import Expand from '@arcgis/core/widgets/Expand';
import UI from '@arcgis/core/views/ui/UI';
import * as PromiseUtils from '@arcgis/core/core/PromiseUtils';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Symbol from '@arcgis/core/symbols/Symbol';
import Renderer from '@arcgis/core/renderers/Renderer';
import * as rendererJsonUtils from '@arcgis/core/renderers/support/jsonUtils';
import * as cimSymbolUtils from '@arcgis/core/symbols/support/cimSymbolUtils';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
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
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';
//import { type } from 'os';

@Component({
  selector: 'app-esri-3d-map',
  templateUrl: './esri-3d-map.component.html',
  styleUrls: ['./esri-3d-map.component.scss'],
})
export class Esri3DMapComponent implements OnInit, OnDestroy {
  public view: any = null;
  mapSize: string = 'thumbnail';
  fullScreen: boolean = false;
  private _zoom = 13;
  private _center: Array<number> = [-74.5, 40.8];
  private _basemap = 'streets';
  private _loaded = false;
  //  private _view: esri.MapView = null;
  private _height = '100%';
  private _width = '100%';
  private _extent: Array<number> = [-8337000, 4960000, -8263000, 5023000];
  // Create elevation layer and add to the map
  elevationLayer = new ElevationLayer({
    url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/TopoBathy3D/ImageServer',
    visible: true,
  });

  // The clipping extent for the scene
  courthouseComplexExtent: any = {
    // autocasts as new Extent()
    xmax: -74.4814,
    xmin: -74.4859,
    ymax: 40.7983,
    ymin: 40.7957,
    spatialReference: {
      // autocasts as new SpatialReference()
      wkid: 4326,
    },
  };

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
  @ViewChild('sceneViewNode', { static: true }) private mapViewEl: ElementRef;
  @ViewChild('mapToolbar', { static: true }) private mapToolbar: ElementRef;

  initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    // Configure the Map
    var basemap = Basemap.fromId(this._basemap);

    // Create a SimpleMarkerSymbol from the JSON representation
    //const renderer = Renderer.fromJSON(rendererJSON);
    // Set the renderer on the layer

    const webscene = new WebScene({
      basemap: 'topo-vector',
      ground: 'world-elevation',
    });

    //  webscene.add(buildingsLayer);
    // const view = new MapView({
    //   container,
    //   map: webmap,
    //   center: this._center,
    //   zoom: this._zoom,
    // });

    // create the SceneView
    const view = new SceneView({
      container,
      map: webscene,
      viewingMode: 'local',
      // Use the exent defined in clippingArea to define the bounds of the scene
      clippingArea: this.courthouseComplexExtent,
      extent: this.courthouseComplexExtent,
      camera: {
        position: {
          x: -74.488,
          y: 40.7935,
          spatialReference: {
            wkid: 4326,
          },
          z: 450,
        },
        heading: 44.51,
        tilt: 60,
      },
      // camera: {
      //   position: {
      //     x: -75.09519011,
      //     y: 38.32524201,
      //     spatialReference: {
      //       wkid: 102100
      //     },
      //     z: 682.98652
      //   },
      //   heading: 53.86,
      //   tilt: 48.52
      // },
      highlightOptions: {
        haloOpacity: 0,
      },
    });

    const parcels = new FeatureLayer({
      url: 'http://morrisgisapps.co.morris.nj.us/arcgis105/rest/services/MCMUA/MCMUAFeatures/MapServer/10',
      popupTemplate: {
        title: 'Parcel: {PAMS_PIN}',
        content: 'Address: {StreetAddress}',
      },
    });

    webscene.add(parcels);

    view.ui.add(['createSlideDiv', 'slidesDiv'], 'top-right');

    /*****************************************************************
     * Create a function that generates symbols for extruded polygons.
     *****************************************************************/

    function getSymbol(color: string) {
      return {
        type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
        symbolLayers: [
          {
            type: 'extrude', // autocasts as new ExtrudeSymbol3DLayer()
            material: {
              color: color,
            },
            edges: {
              type: 'solid',
              color: '#999',
              size: 0.5,
            },
          },
        ],
      };
    }

    /*****************************************************************
     * Set each unique value directly in the renderer's constructor.
     * At least one field must be used (in this case the "DESCLU" field).
     * The label property of each unique value will be used to indicate
     * the field value and symbol in the legend.
     *
     * The size visual variable sets the height of each building as it
     * exists in the real world according to the "ELEVATION" field.
     *****************************************************************/

    /*********************************************************************
     * Function to create the UI for a slide by creating DOM nodes and
     * adding them to the slidesDiv container.
     *********************************************************************/
    function createSlideUI(slide: any, placement: any) {
      /*********************************************************************
       * Create a new <div> element which contains all the slide information.
       * Store a reference to the created DOM node so we can use it to place
       * other DOM nodes and connect events.
       *********************************************************************/
      var slideElement = document.createElement('div');
      // Assign the ID of the slide to the <span> element
      slideElement.id = slide.id;
      slideElement.classList.add('slide');

      /*********************************************************************
       * Place the newly created DOM node cat the beginning of the slidesDiv
       *********************************************************************/
      var slidesDiv = document.getElementById('slidesDiv');
      if (placement === 'first') {
        slidesDiv.insertBefore(slideElement, slidesDiv.firstChild);
      } else {
        slidesDiv.appendChild(slideElement);
      }

      /*********************************************************************
       * Create a <div> element to contain the slide title text
       *********************************************************************/
      var title = document.createElement('div');
      title.innerText = slide.title.text;
      // Place the title of the slide in the <div> element
      slideElement.appendChild(title);

      /*********************************************************************
       * Create a new <img> element and place it inside the newly created slide
       * element. This will reference the thumbnail from the slide.
       *********************************************************************/
      var img = new Image();
      // Set the src URL of the image to the thumbnail URL of the slide
      img.src = slide.thumbnail.url;
      // Set the title property of the image to the title of the slide
      img.title = slide.title.text;
      // Place the image inside the new <div> element
      slideElement.appendChild(img);

      /*********************************************************************
       * Set up a click event handler on the newly created slide. When clicked,
       * the code defined below will execute.
       *********************************************************************/
      slideElement.addEventListener('click', function () {
        /*******************************************************************
         * Remove the "active" class from all elements with the .slide class
         *******************************************************************/
        var slides = document.querySelectorAll('.slide');
        Array.from(slides).forEach(function (node) {
          node.classList.remove('active');
        });

        /*******************************************************************
         * Add the "active" class on the current element being selected
         *******************************************************************/
        slideElement.classList.add('active');

        /******************************************************************
         * Applies a slide's settings to the SceneView.
         *
         * Each slide has a viewpoint and visibleLayers property that define
         * the point of view or camera for the slide and the layers that should
         * be visible to the user when the slide is selected. This method
         * allows the user to animate to the given slide's viewpoint and turn
         * on its visible layers and basemap layers in the view.
         ******************************************************************/
        slide.applyTo(view);
      });
    }

    // const bookmarks = new Bookmarks({
    //   view,
    //   // allows bookmarks to be added, edited, or deleted
    //   editingEnabled: true,
    // });

    // const bkExpand = new Expand({
    //   view,
    //   content: bookmarks,
    //   expanded: true,
    // });

    // Add the widget to the top-right corner of the view
    //  view.ui.add(bkExpand, 'top-right');

    // bonus - how many bookmarks in the webmap?
    view.when(function () {
      /*********************************************************************
       * The slides will be placed in the 'slidesDiv' <div> element.
       *********************************************************************/
      document.getElementById('slidesDiv').style.visibility = 'visible';

      /*********************************************************************
       * The slides are a collection inside the presentation property of
       * the WebScene.
       *********************************************************************/
      var slides = webscene.presentation.slides;

      /*********************************************************************
       * Loop through each slide in the collection and render the slide
       *********************************************************************/
      slides.forEach(createSlideUI);

      /*********************************************************************
       * Create a new slide using Slide.createFrom after clicking on the
       * create slide button, using the text from the title input for the
       * title of the slide.
       *********************************************************************/
      document.getElementById('createSlideButton').addEventListener('click', function () {
        /*******************************************************************
         * Use the Slide.createFrom static method to create a new slide which
         * contains a snapshot (visible layers, basemap, camera) of the
         * current view. This method returns a Promise which resolves with a
         * new Slide instance once the slide as been successfully created.
         *******************************************************************/
        Slide.createFrom(view).then(function (slide) {
          /*****************************************************************
           * Set the slide title
           *****************************************************************/
          slide.title.text = (<HTMLInputElement>document.getElementById('createSlideTitleInput')).value;

          /*****************************************************************
           * Add the slide to the slides collection of the scene presentation
           * such that if the scene were to published back to the portal, the
           * newly created slide would be correctly persisted as part of the
           * WebScene
           *****************************************************************/
          webscene.presentation.slides.add(slide);

          /*****************************************************************
           * Create UI for the slide and present it to the user
           *****************************************************************/
          createSlideUI(slide, 'first');
        });
      });
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
