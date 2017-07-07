import LayerHierarchy from './Leaflet.LayerHierarchy';

import { defaultsDeep as defaults } from 'lodash';
// superagent mimics the node 'request' library on the client side
// used for xhr/ajax
import superagent from 'superagent';
import Promise from 'bluebird';
import superagentPromise from 'superagent-promise';
const request = superagentPromise(superagent, Promise);
import { FeatureLayerService } from 'esri-leaflet';

/**
 * Parses the layer data served by an ArcGIS MapServer
 * @param {string} url A valid and reachable ArcGIS MapServer URL
 * @param {L.Map} map A Leaflet Map object, which will be passed to all
 * the layers in the resulting LayerHierarchy
 * @param {object} [options] An optional configuration object
 */
export default class MapServerParser {

  static APISuffixes = {
    layers: '/layers',
    legend: '/legend'
  };

  static JSONQueryParameters = {
    f: 'json'
  };

  static Headers = {
    Accept: 'application/json'
  };

  /**
   * Initializes the parser with the given parameters
   * @param {string} url     A valid and reachable ArcGIS MapServer URL
   * @param {L.Map} map     A Leaflet Map object, which will be passed to all
   * the layers in the resulting LayerHierarchy
   * @param {object} [options] An optional configuration object
   * @param {object} [options.data] The configuration options related to what data
   * should be parsed from the MapServer to be included on NestedLayer objects
   * @param {boolean} [options.data.scale=true] Include minZoom and maxZoom
   * parameters on the NestedLayer
   * @param {boolean} [options.data.defaultVisibility=true] Include the
   * initial selected state of the NestedLayer
   * @param {object} [options.hierarchyOptions={}] The configuration options
   * the NestedHierarchy takes on instantiation
   */
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

    // set default options
    this._defaults = {
      data: {
        scale: true,
        defaultVisibility: true
      },
      hierarchyOptions: {}
    }

    // merge options with defaults
    this._options = {};
    // https://lodash.com/docs/4.17.4#defaultsDeep
    defaults(this._options, options, this.defaults);
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
    return this._defaults;
  }

  parse() {
    // setup the promise we will return
    const p = new Promise((resolve, reject) => {

    });

    // query the layers endpoint and resolve the promise
    this._queryLayers().then((res) => {
      // ensure we hit HTTP 2xx status
      if (!res.ok) {
        throw new Error('Non-HTTP status 200');
      }

      let body = res.body;
      // ArcGIS does not properly set its Content-Type header
      // so force JSON parsing if superagent did not parse automatically
      if (res.type !== MapServerParser.Headers.Accept) {
        body = JSON.parse(res.text);
      }

      // create the LayerHierarchy
      let hierarchy = new LayerHierarchy(this.options.hierarchyOptions);

      // loop through each layer and make a NestedLayer based on it
      let layers = body.layers.map(
        this._processLayerNode.bind(this, hierarchy.makeLayer)
        );
    });

    return p;
  }

  /**
   * Queries the layers endpoint of the MapServer for layer data.
   * @return {Promise} Promise that resolves the request.
   */
  _queryLayers() {
    // assemble layerdata url
    const layerdataURL = this.url + MapServerParser.APISuffixes.layers;

    // ArcGIS does not properly set its Content-Type header
    // so force superagent to use JSON parsing
    // superagent.parse['text/plain'] = JSON.parse;

    // fetch layerdata as JSON
    return request
      .get(layerdataURL)
      .set(MapServerParser.Headers)
      .query(MapServerParser.JSONQueryParameters)
      .end();
  }

  _processLayerNode = (layerFactory, node) => {
    // NestedLayer data
    let layerData = {
      id: node.id,
      name: node.name,
      map: this.map
    };
    // Leaflet layer data
    let leafletLayerData = {
      url: MapServerParser._makeLayerURL(this.url, layerData.id)
    };

    // get scale/zoom data from layer node
    if (this.options.data.scale) {
      // converts scale factor from ArcGIS to Leaflet's zoom factor
      // http://leafletjs.com/reference-1.1.0.html#crs-scale
      leafletLayerData.maxZoom = this.map.zoom(node.maxScale);
      leafletLayerData.minZoom = this.map.zoom(node.minScale);
    }

    // attach the Leaflet layer object to the NestedLayer's data
    layerData.layer = new FeatureLayerService(leafletLayerData);

    // use the provided NestedLayer factory to turn layerData into an owned NestedLayer
    let layer = layerFactory(layerData);

    // set the selected state = to the node's default visibility state
    if (this.options.data.defaultVisibility) {
      layer.selected = node.defaultVisibility;
    }

    // returns a NestedLayer object
    return layer;
  }

  static _makeLayerURL(baseURL, layerID) {
    if (typeof baseURL !== 'string') {
      throw new Error('Base URL was undefined, null, or was not a string');
    }
    if (typeof layerID !== 'number') {
      throw new Error('ID was undefined, null, or was not a number');
    }

    return baseURL + '/' + layerID.toString();
  }

}
