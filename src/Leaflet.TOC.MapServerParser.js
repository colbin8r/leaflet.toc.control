import { defaultsDeep as defaults } from 'lodash';
// superagent mimics the node 'request' library on the client side as an xhr library
import superagent from 'superagent';
import Promise from 'bluebird';
import superagentPromise from 'superagent-promise';
const request = superagentPromise(superagent, Promise);

import NestedDynamicMapLayer from './Leaflet.TOC.NestedDynamicMapLayer';
import NestedGroupLayer from './Leaflet.TOC.NestedGroupLayer';
import * as NestedLayerTreeHelper from './Leaflet.TOC.NestedLayerTreeHelper';
import MapSymbol from './Leaflet.TOC.MapSymbol';
import { DynamicMapLayer } from 'esri-leaflet';

export default class MapServerParser {

  static _defaults = {
    parsingOptions: {
      scale: true,
      defaultVisibility: true,
      symbology: false
    },
    layerProps: {},
    dynamicMapLayerOptions: {}
  };

  static APIEndpoints = {
    layers: '/layers',
    legend: '/legend'
  };

  static QueryParameters = {
    f: 'json'
  };

  static Headers = {
    Accept: 'application/json'
  };

  constructor(url, map, options) {
    // ensure required parameters are present
    if (typeof url == 'undefined') {
      throw new Error('Missing URL when creating MapServerParser');
    }
    if (typeof map == 'undefined') {
      throw new Error('Missing Leaflet map object when creating MapServerParser');
    }

    // save url
    this._url = url;

    // save map
    this._map = map;

    // https://lodash.com/docs/4.17.4#defaultsDeep
    this._options = defaults({}, options, this.defaults);

    // create a new DynamicMapLayer to use in all of our NestedDynamicMapLayers
    let layerOptions = defaults({ url }, this.options.dynamicMapLayerOptions)
    this._layer = new DynamicMapLayer(layerOptions);
  }

  /**
   * MapServer URL
   * @type {string}
   */
  get url() {
    return this._url;
  }

  /**
   * Leaflet Map object
   * @type {L.Map}
   */
  get map() {
    return this._map;
  }

  /**
   * Configuration options
   * @type {object}
   */
  get options() {
    return this._options;
  }

  /**
   * Default configuration options
   * @type {object}
   */
  get defaults() {
    // uses reflection to return the static _defaults property on the class
    return this.constructor._defaults;
  }

  /**
   * Esri-Leaflet DynamicMapLayer object
   * @type {DynamicMapLayer}
   */
  get layer() {
    return this._layer;
  }

  parse() {
    // we have to wait for both xhr promises to resolve before we can begin processing
    // note that Promise.join returns a promise that resolves to a LayerHierarchy
    return Promise.join(this._queryLayers(), this._queryLegend(), (layerResponse, legendResponse) => {
      // ensure we hit HTTP 2xx statuses
      if (!layerResponse.ok || !legendResponse.ok) {
        throw new Error('Bad request: HTTP status was not 2xx');
      }

      // parse the layer data into JSON
      let layers = this._parseBodyAsJSON(layerResponse);

      // parse the legend data into JSON
      let legend = this._parseBodyAsJSON(legendResponse);

      // restrict ourselves to the 'layers' node of the response bodies
      layers = layers.layers;
      legend = legend.layers;

      let tree = [];

      layers.forEach((node) => {
        let layer = this._parseNode(node);

        if (this.options.parsingOptions.defaultVisibility) {
          layer.selected = node.defaultVisibility;
        }

        if (this.options.parsingOptions.symbology) {

          // find the entry in the legend corresponding to the current layer
          let legendEntry = legend.find((legendNode) => {
            return legendNode.layerId == layer.layerID;
          })

          // confirm that there is symbology for the layer
          if (legendEntry && legendEntry.legend && legendEntry.legend.length > 0) {

            // add each entry from the legend node in the entry as a MapSymbol
            legendEntry.legend.forEach((entry, idx) => {
              layer.symbology.addSymbol(new MapSymbol(entry));
            })

          }
        }

        // add the layer into the proper subtree
        if (node.parentLayer !== null) {
          let parentID = node.parentLayer.id;
          // this assumes that the parent has already been parsed
          let parent = NestedLayerTreeHelper.getLayerByLayerID(tree, parentID);
          parent.addChild(layer);
        } else {
          tree.push(layer);
        }
      })

      return tree;
    });
  }

  _queryLayers() {
    // assemble layerdata url
    const layerdataURL = this.url + this.constructor.APIEndpoints.layers;

    // fetch layerdata as JSON
    return request
      .get(layerdataURL)
      .set(this.constructor.Headers)
      .query(this.constructor.QueryParameters)
      .end();
  }

  _queryLegend() {
    // assemble legend url
    const legendURL = this.url + this.constructor.APIEndpoints.legend;

    // fetch legend as JSON
    return request
      .get(legendURL)
      .set(this.constructor.Headers)
      .query(this.constructor.QueryParameters)
      .end();
  }

  _parseBodyAsJSON(response) {
    // parse the data into JSON
    let body = response.body;
    // ArcGIS does not properly set its Content-Type header
    // so force JSON parsing if superagent did not parse automatically
    if (response.type !== this.constructor.Headers.Accept) {
      body = JSON.parse(response.text);
    }

    return body;
  }

  _parseNode(node) {
    let layerType;

    switch (node.type) {
      case 'Group Layer':
        layerType =  NestedGroupLayer;
        break;
      case 'Feature Layer':
        layerType = NestedDynamicMapLayer
        break;
      default:
        throw 'Invalid layer type: ' + node.type;
        break;
    }

    return new layerType(
      node.id,
      node.name,
      this.layer,
      this.map,
      this.options.layerProps);
  }

}
