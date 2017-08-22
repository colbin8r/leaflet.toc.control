'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// superagent mimics the node 'request' library on the client side as an xhr library


var _lodash = require('lodash');

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

var _LeafletTOC = require('./Leaflet.TOC.NestedDynamicMapLayer');

var _LeafletTOC2 = _interopRequireDefault(_LeafletTOC);

var _LeafletTOC3 = require('./Leaflet.TOC.NestedGroupLayer');

var _LeafletTOC4 = _interopRequireDefault(_LeafletTOC3);

var _LeafletTOC5 = require('./Leaflet.TOC.NestedLayerTreeHelper');

var NestedLayerTreeHelper = _interopRequireWildcard(_LeafletTOC5);

var _LeafletTOC6 = require('./Leaflet.TOC.MapSymbol');

var _LeafletTOC7 = _interopRequireDefault(_LeafletTOC6);

var _esriLeaflet = require('esri-leaflet');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = (0, _superagentPromise2.default)(_superagent2.default, _bluebird2.default);

var MapServerParser = function () {
  function MapServerParser(url, map, options) {
    _classCallCheck(this, MapServerParser);

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
    this._options = (0, _lodash.defaultsDeep)({}, options, this.defaults);

    // create a new DynamicMapLayer to use in all of our NestedDynamicMapLayers
    var layerOptions = (0, _lodash.defaultsDeep)({ url: url }, this.options.dynamicMapLayerOptions);
    this._layer = new _esriLeaflet.DynamicMapLayer(layerOptions);
  }

  /**
   * MapServer URL
   * @type {string}
   */


  _createClass(MapServerParser, [{
    key: 'parse',
    value: function parse() {
      var _this = this;

      // we have to wait for both xhr promises to resolve before we can begin processing
      // note that Promise.join returns a promise that resolves to a LayerHierarchy
      return _bluebird2.default.join(this._queryLayers(), this._queryLegend(), function (layerResponse, legendResponse) {
        // ensure we hit HTTP 2xx statuses
        if (!layerResponse.ok || !legendResponse.ok) {
          throw new Error('Bad request: HTTP status was not 2xx');
        }

        // parse the layer data into JSON
        var layers = _this._parseBodyAsJSON(layerResponse);

        // parse the legend data into JSON
        var legend = _this._parseBodyAsJSON(legendResponse);

        // restrict ourselves to the 'layers' node of the response bodies
        layers = layers.layers;
        legend = legend.layers;

        var tree = [];

        layers.forEach(function (node) {
          var layer = _this._parseNode(node);

          if (_this.options.parsingOptions.defaultVisibility) {
            layer.selected = node.defaultVisibility;
          }

          if (_this.options.parsingOptions.symbology) {

            // find the entry in the legend corresponding to the current layer
            var legendEntry = legend.find(function (legendNode) {
              return legendNode.layerId == layer.layerID;
            });

            // confirm that there is symbology for the layer
            if (legendEntry && legendEntry.legend && legendEntry.legend.length > 0) {

              // add each entry from the legend node in the entry as a MapSymbol
              legendEntry.legend.forEach(function (entry) {
                layer.symbology.addSymbol(new _LeafletTOC7.default(entry));
              });
            }
          }

          if (_this.options.parsingOptions.scale) {
            // convert the 'scale' data returned by ArcGIS to 'zoom' data used by Leaflet
            // if ArcGIS returns '0', set to Inifinity or -Infinity where appropriate
            // http://leafletjs.com/reference-1.2.0.html#crs-zoom
            // https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L39
            var leafletMostZoomedInLevel = 19;
            var leafletLeastZoomedInLevel = 1;
            var max = node.maxScale !== 0 ? leafletLeastZoomedInLevel + _this.map.options.crs.zoom(node.maxScale) : Number.POSITIVE_INFINITY;
            var min = node.minScale !== 0 ? leafletMostZoomedInLevel - _this.map.options.crs.zoom(node.minScale) : Number.NEGATIVE_INFINITY;
            console.log('MapServerParser min', min, 'max', max);
            // console.log('nodemax', node.maxScale, 'min', min, 'nodemin', node.minScale, 'max', max);
            layer.minZoom = min;
            layer.maxZoom = max;
          }

          // add the layer into the proper subtree
          if (node.parentLayer !== null) {
            var parentID = node.parentLayer.id;
            // this assumes that the parent has already been parsed
            var parent = NestedLayerTreeHelper.getLayerByLayerID(tree, parentID);
            parent.addChild(layer);
          } else {
            tree.push(layer);
          }
        });

        NestedLayerTreeHelper.validateTreeEnabledState(tree);

        return tree;
      });
    }
  }, {
    key: '_queryLayers',
    value: function _queryLayers() {
      // assemble layerdata url
      var layerdataURL = this.url + this.constructor.APIEndpoints.layers;

      // fetch layerdata as JSON
      return request.get(layerdataURL).set(this.constructor.Headers).query(this.constructor.QueryParameters).end();
    }
  }, {
    key: '_queryLegend',
    value: function _queryLegend() {
      // assemble legend url
      var legendURL = this.url + this.constructor.APIEndpoints.legend;

      // fetch legend as JSON
      return request.get(legendURL).set(this.constructor.Headers).query(this.constructor.QueryParameters).end();
    }
  }, {
    key: '_parseBodyAsJSON',
    value: function _parseBodyAsJSON(response) {
      // parse the data into JSON
      var body = response.body;
      // ArcGIS does not properly set its Content-Type header
      // so force JSON parsing if superagent did not parse automatically
      if (response.type !== this.constructor.Headers.Accept) {
        body = JSON.parse(response.text);
      }

      return body;
    }
  }, {
    key: '_parseNode',
    value: function _parseNode(node) {
      var layerType = void 0;

      switch (node.type) {
        case 'Group Layer':
          layerType = _LeafletTOC4.default;
          break;
        case 'Feature Layer':
          layerType = _LeafletTOC2.default;
          break;
        default:
          throw 'Invalid layer type: ' + node.type;
      }

      return new layerType(node.id, node.name, this.layer, this.map, this.options.layerProps);
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
      // uses reflection to return the static _defaults property on the class
      return this.constructor._defaults;
    }

    /**
     * Esri-Leaflet DynamicMapLayer object
     * @type {DynamicMapLayer}
     */

  }, {
    key: 'layer',
    get: function get() {
      return this._layer;
    }
  }]);

  return MapServerParser;
}();

MapServerParser._defaults = {
  parsingOptions: {
    scale: true,
    defaultVisibility: true,
    symbology: false
  },
  layerProps: {},
  dynamicMapLayerOptions: {}
};
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
//# sourceMappingURL=Leaflet.TOC.MapServerParser.js.map
