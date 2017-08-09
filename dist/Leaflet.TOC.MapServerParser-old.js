'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parses the layer data served by an ArcGIS MapServer
 * @param {string} url A valid and reachable ArcGIS MapServer URL
 * @param {L.Map} map A Leaflet Map object, which will be passed to all
 * the layers in the resulting LayerHierarchy
 * @param {object} [options] An optional configuration object
 */
var MapServerParser = function () {

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
  function MapServerParser(url, map, options) {
    var _this = this;

    _classCallCheck(this, MapServerParser);

    this._convertLayerNodeToNestedLayer = function (node, legend) {
      var nestedLayerData = {
        id: node.id,
        name: node.name.trim(),
        map: _this.map
      };
      // Leaflet layer data
      var leafletLayerData = {
        url: MapServerParser._makeLayerURL(_this.url, nestedLayerData.id)
      };

      // get scale/zoom data from layer node
      if (_this.options.data.scale) {
        // converts scale factor from ArcGIS to Leaflet's zoom factor
        // http://leafletjs.com/reference-1.1.0.html#crs-scale
        // leafletLayerData.maxZoom = this.map.options.crs.zoom(node.maxScale);
        // leafletLayerData.minZoom = this.map.options.crs.zoom(node.minScale);
        console.warn('Floor\'ing maxZoom and ceil\'ing minZoom');
        // console.log(nestedLayerData.name, 'minZoom', leafletLayerData.minZoom, 'maxZoom', leafletLayerData.maxZoom)
        leafletLayerData.maxZoom = Math.floor(_this.map.options.crs.zoom(node.maxScale));
        leafletLayerData.minZoom = Math.ceil(_this.map.options.crs.zoom(node.minScale));
      }

      // attach the swatch data
      // if (this.options.data.swatch && legend[nestedLayerData.id].legend.length > 0) {
      //   nestedLayerData.swatch = legend[nestedLayerData.id].legend[0].imageData;
      //   console.log(nestedLayerData.name, nestedLayerData.id, nestedLayerData.swatch);
      // }
      if (_this.options.data.swatch) {
        nestedLayerData.swatch = MapServerParser._findSwatchInLegend(legend, nestedLayerData.id);
      }

      // attach the Leaflet layer object to the NestedLayer's data
      nestedLayerData.layer = new FeatureLayer(leafletLayerData);

      // create a new NestedLayer that wraps the Leaflet layer, map, etc.
      var layer = new NestedLayer(nestedLayerData);

      // set the selected state = to the node's default visibility state
      if (_this.options.data.defaultVisibility) {
        layer.selected = node.defaultVisibility;
      }

      // returns a NestedLayer object
      return layer;
    };

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
        defaultVisibility: true,
        swatch: false
      },
      hierarchyOptions: {}

      // merge options with defaults
    };this._options = {};
    // https://lodash.com/docs/4.17.4#defaultsDeep
    defaults(this._options, options, this.defaults);
  }

  /**
   * MapServer URL
   * @type {string}
   */


  _createClass(MapServerParser, [{
    key: 'parse',
    value: function parse() {
      var _this2 = this;

      // we have to wait for both xhr promises to resolve before we can begin processing
      // note that Promise.join returns a promise that resolves to a LayerHierarchy
      return Promise.join(this._queryLayers(), this._queryLegend(), function (layerRes, legendRes) {
        // ensure we hit HTTP 2xx statuses
        if (!layerRes.ok || !legendRes.ok) {
          throw new Error('Bad request: HTTP status was not 2xx');
        }

        // parse the layerdata into JSON
        var body = layerRes.body;
        // ArcGIS does not properly set its Content-Type header
        // so force JSON parsing if superagent did not parse automatically
        if (layerRes.type !== MapServerParser.Headers.Accept) {
          body = JSON.parse(layerRes.text);
        }

        // parse the legend into JSON
        var legend = legendRes.body;
        // ArcGIS does not properly set its Content-Type header
        // so force JSON parsing if superagent did not parse automatically
        if (legendRes.type !== MapServerParser.Headers.Accept) {
          legend = JSON.parse(legendRes.text);
        }
        // the actual legend is located under the 'layers' node
        legend = legend.layers;

        // create the LayerHierarchy
        var hierarchy = new LayerHierarchy(_this2.options.hierarchyOptions);

        // move layers down as children of other layers
        body.layers.forEach(function (node) {
          var layer = _this2._convertLayerNodeToNestedLayer(node, legend);
          var parent = node.parentLayer !== null ? node.parentLayer.id : undefined;
          // if this layer has no parent, addLayer(...) will add as a root layer
          hierarchy.addLayer(layer, parent);
        });

        // resolve the promise with the resulting LayerHierarchy
        return hierarchy;
      });
    }

    /**
     * Queries the layers endpoint of the MapServer for layer data.
     * @return {Promise} Promise that resolves the request.
     */

  }, {
    key: '_queryLayers',
    value: function _queryLayers() {
      // assemble layerdata url
      var layerdataURL = this.url + MapServerParser.APIEndpoints.layers;

      // fetch layerdata as JSON
      return request.get(layerdataURL).set(MapServerParser.Headers).query(MapServerParser.QueryParameters).end();
    }
  }, {
    key: '_queryLegend',
    value: function _queryLegend() {
      // assemble legend url
      var legendURL = this.url + MapServerParser.APIEndpoints.legend;

      // fetch legend as JSON
      return request.get(legendURL).set(MapServerParser.Headers).query(MapServerParser.QueryParameters).end();
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }

    /**
     * Leaflet Map object
     * @type {L.Map}
     */

  }, {
    key: 'map',
    get: function get() {
      return this._map;
    }

    /**
     * Configuration options
     * @type {object}
     */

  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }

    /**
     * Default configuration options
     * @type {object}
     */

  }, {
    key: 'defaults',
    get: function get() {
      return this._defaults;
    }
  }], [{
    key: '_findSwatchInLegend',
    value: function _findSwatchInLegend(legend, layerID) {
      // if no swatches even exist (e.g. invalid legend)
      if (legend.length <= 0) {
        return '';
      }

      // loop through to try to find a valid swatch
      // this algorithm could be optimized from O(n) due to
      // the sorted nature of the legend
      // it just must account for the fact that a legend object may not exist for
      // any given layer
      for (var i = 0; i < legend.length; i++) {
        if (legend[i].layerId == layerID && legend[i].legend.length > 0) {
          return legend[i].legend[0].imageData;
        }
      }

      // no swatch found
      return '';
    }
  }, {
    key: '_makeLayerURL',
    value: function _makeLayerURL(baseURL, layerID) {
      if (typeof baseURL !== 'string') {
        throw new Error('Base URL was undefined, null, or was not a string');
      }
      if (typeof layerID !== 'number') {
        throw new Error('ID was undefined, null, or was not a number');
      }

      return baseURL + '/' + layerID.toString();
    }
  }]);

  return MapServerParser;
}();

MapServerParser.APIEndpoints = {
  layers: '/layers',
  legend: '/legend'
};
MapServerParser.QueryParameters = {
  f: 'json'
};
MapServerParser.Headers = {
  Accept: 'application/json'
};
exports.default = MapServerParser;
//# sourceMappingURL=Leaflet.TOC.MapServerParser-old.js.map
